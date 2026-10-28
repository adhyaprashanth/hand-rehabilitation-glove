/**
 * services/serial/webSerial.js
 *
 * Web Serial API service to connect directly to the ESP32 over USB at 115200 baud.
 * Works natively in Chrome, Edge, Brave, and Opera without any backend server.
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
    await port.open({ baudRate: 115200 });

    activePort = port;
    keepReading = true;
    onConnectionChange(true, 'ESP32 Connected');

    // 2. Setup text decoder stream pipeline
    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable).catch((err) => {
      console.warn('[WebSerial] Pipe closed:', err);
    });

    const reader = textDecoder.readable.getReader();
    activeReader = reader;

    let buffer = '';

    // 3. Read stream loop
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        buffer += value;
        const lines = buffer.split(/\r?\n/);
        // Keep the last partial segment in the buffer
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (line.length > 0) {
            onRawLineReceived(line);
          }
        }
      }
    }

    reader.releaseLock();
  } catch (err) {
    if (err.name !== 'NotFoundError') {
      console.error('[WebSerial Error]', err);
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
