import Kafka from "node-rdkafka";
import { configFromPath } from "./util";

class Producer {
  producer;
  readyProducer;
  topic = "purchases";

  constructor() {
  }

  async createConfigMap() {
    const config = await configFromPath("getting-started.properties")
    if (config.hasOwnProperty("security.protocol")) {
      return {
        "bootstrap.servers": config["bootstrap.servers"],
        "sasl.username": config["sasl.username"],
        "sasl.password": config["sasl.password"],
        "security.protocol": config["security.protocol"],
        "sasl.mechanisms": config["sasl.mechanisms"],
        dr_msg_cb: true,
      };
    } else {
      return {
        "bootstrap.servers": config["bootstrap.servers"],
        dr_msg_cb: true,
      };
    }
  }

  async createProducer(onDeliveryReport) {
    this.producer = new Kafka.Producer(await this.createConfigMap());
    return new Promise((resolve, reject) => {
      this.producer
        .on("ready", () => resolve(this.producer))
        .on("delivery-report", onDeliveryReport)
        .on("event.error", (err) => {
          console.warn("event.error", err);
          reject(err);
        });
      this.producer.connect();
    });
  }

  async setProducer() {
    console.log("this is getting called")
    this.readyProducer = await this.createProducer((err, report) => {
      if (err) {
        console.warn("Error producing", err);
      } else {
        const { topic, key, value } = report;
        let k = key.toString().padEnd(10, " ");
        console.log(
          `Produced event to topic ${topic}: key = ${k} value = ${value}`
        );
      }
    });
  }

  sendMessage(message: string) {
    (this.readyProducer as Kafka.Producer).produce(
      this.topic,
      -1,
      Buffer.from("value"),
      Buffer.from(message)
    );
  }

  disconnectProducer() {
    // (this.readyProducer as any).flush(10000, () => {
    (this.readyProducer as any).disconnect();
    // });
  }
}

export { Producer };
