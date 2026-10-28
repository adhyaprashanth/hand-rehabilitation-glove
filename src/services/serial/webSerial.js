/**
 * services/serial/webSerial.js
 *
 * Web Serial API service to connect directly to the ESP32 over USB at 115200 baud.
 * Works natively in Chrome, Edge, Brave, and Opera.
 */

let activePort = null;
let activeReader = null;
let keepReading = false;

/**
 * Check if Web Serial API is supported in this browser
 */
export function isWebSerialSupported() {
  return typeof navigator !== 'undefined' && 'serial' in navigator;
}

/**
 * Request user to pick the ESP32 COM port and start reading lines
 *
 * @param {function(string): void} onRawLineReceived - Callback for every received line
 * @param {function(boolean, string): void} onConnectionChange - Callback when connected/disconnected
 */
export async function connectWebSerial(onRawLineReceived, onConnectionChange) {
  if (!isWebSerialSupported()) {
    alert('Web Serial is not supported in this browser. Please use Google Chrome, Microsoft Edge, Brave, or Opera.');
    return false;
  }

  try {
    // 1. Prompt user to select USB Serial port
    const port = await navigator.serial.requestPort();
    
    // 2. Open serial port at 115200 baud
    await port.open({ baudRate: 115200 });

    activePort = port;
    keepReading = true;
    onConnectionChange(true, 'ESP32 Connected');

    // 3. Direct ReadableStream reader + TextDecoder (fail-safe without pipeTo locking)
    const reader = port.readable.getReader();
    activeReader = reader;
    const decoder = new TextDecoder();
    let buffer = '';

    // 4. Read stream loop
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (line.length > 0) {
            onRawLineReceived(line);
          }
        }
      }
    }

    try {
      reader.releaseLock();
    } catch {
      // ignore
    }
  } catch (err) {
    if (err.name === 'NotFoundError') {
      // User cancelled the prompt dialog - no alert needed
      console.log('[WebSerial] Port selection cancelled by user.');
    } else {
      console.error('[WebSerial Error]', err);
      alert(
        `⚠️ Failed to connect to ESP32: ${err.message || err}\n\n` +
        `IMPORTANT: If the Arduino IDE Serial Monitor is open, please CLOSE IT completely! ` +
        `Only one application can use the COM port at a time.`
      );
    }
    await disconnectWebSerial(onConnectionChange);
    return false;
  }

  return true;
}

/**
 * Disconnect and release the serial port
 */
export async function disconnectWebSerial(onConnectionChange) {
  keepReading = false;

  try {
    if (activeReader) {
      await activeReader.cancel();
      activeReader = null;
    }
  } catch (e) {
    console.warn('[WebSerial] Error closing reader:', e);
  }

  try {
    if (activePort) {
      await activePort.close();
      activePort = null;
    }
  } catch (e) {
    console.warn('[WebSerial] Error closing port:', e);
  }

  if (onConnectionChange) {
    onConnectionChange(false, 'Disconnected');
  }
}
