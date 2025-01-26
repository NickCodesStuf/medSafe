/* eslint-disable no-undef */
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
// import readline from "readline";

// SerialPort.list().then((ports) => {
//   ports.forEach((port) => {
//     console.log(port.path);
//   });
// });

// const port = new SerialPort({ path: "COM5", baudRate: 9600 });
// const parser = port.pipe(new ReadlineParser());

// port.on("open", () => {
//   console.log("Port open");
// });

// parser.on("data", (data) => {
//   console.log("Received:", data);
// });

// function sendMessage(message) {
//   if (port.isOpen) {
//     const jsonMessage = JSON.stringify(message);
//     port.write(jsonMessage + "\n", (err) => {
//       if (err) {
//         return console.log("Error on write: ", err.message);
//       }
//       console.log("Message sent: ", jsonMessage);
//     });
//   } else {
//     console.log("Port is not open");
//   }
// }

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on("line", (input) => {
//   const message = {
//     message: input,
//     value: Date.now(),
//   };
//   sendMessage(message);
// });

export async function connect(start_datetime, quantity, frequency) {
  return new Promise((resolve, reject) => {
    const port = new SerialPort({ path: "COM5", baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser());

    port.on("open", () => {
      console.log("Port open");
    });

    parser.on("data", (data) => {
      console.log("Received:", data);

      port.write(`Yes`, "utf8", (err) => {
        if (err) {
          console.error("Error writing to port:", err);
          port.close((closeErr) => {
            if (closeErr) {
              console.error(
                "Error closing port after write failure:",
                closeErr
              );
            }
            return reject({ status: 400, message: "Cannot write to serial." });
          });
          return;
        }

        console.log(`Sent: Yes`);

        // Drain ensures all data is sent before closing
        port.drain((drainErr) => {
          if (drainErr) {
            console.error("Error draining port:", drainErr);
            return reject({ status: 400, message: "Error draining the port." });
          }
        });
      });


      
      // Prepare the data to send
      const blob = `${String(start_datetime)}${String(quantity)}${String(
        frequency
      )}`;

      port.write(blob, "utf8", (err) => {
        if (err) {
          console.error("Error writing to port:", err);
          port.close((closeErr) => {
            if (closeErr) {
              console.error(
                "Error closing port after write failure:",
                closeErr
              );
            }
            return reject({ status: 400, message: "Cannot write to serial." });
          });
          return;
        }

        console.log(`Sent: ${blob}`);

        // Drain ensures all data is sent before closing
        port.drain((drainErr) => {
          if (drainErr) {
            console.error("Error draining port:", drainErr);
            return reject({ status: 400, message: "Error draining the port." });
          }

          // Close the port after successfully sending data
          port.close((closeErr) => {
            if (closeErr) {
              console.error("Error closing port:", closeErr);
              return reject({ status: 400, message: "Serial couldn't close." });
            } else {
              console.log("Port closed");
              resolve({
                status: 200,
                message: "Successfully written to serial.",
              });
            }
          });
        });
      });
    });

    port.on("error", (err) => {
      console.error("Serial port error:", err);
      reject({ status: 500, message: "Serial port error." });
    });
  });
}
