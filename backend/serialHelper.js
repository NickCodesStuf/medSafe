import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import readline from 'readline';

SerialPort.list().then(ports => {
  ports.forEach(port => {
    console.log(port.path);
  });
});

const port = new SerialPort({ path: 'COM5', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser());

port.on('open', () => {
  console.log('Port open');
});

parser.on('data', data => {
  console.log('Received:', data);
});

function sendMessage(message) {
    if (port.isOpen) {
        const jsonMessage = JSON.stringify(message);
        port.write(jsonMessage + '\n', err => {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('Message sent: ', jsonMessage);
        });
    } else {
        console.log('Port is not open');
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const message = {
        message: input,
        value: Date.now()
    };
    sendMessage(message);
});