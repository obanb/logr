# Logr 

Logr is a tool for **mocking and measuring web communication**. It allows to simulate both the **active sender side** and the "passive" `API` on the **receiver side**. The tool is primarily intended for local use in development.

#### State: `Under development`

### Motivation:
1. To enable **quick and easy mocking and measurement of web communication** without tedious schema definition. 
2. Exploration of `Deno` technology and the possibility of influencing independently running processes. Following the example of Go (`Goroutines`, `Channels`), in a JS environment (`Web workers`, `Message channels`, `ports`).

### Key Features:
1. **Online reflection** of the request and its headers, based on which similar requests are automatically generated.
2. **Online administration** of creation and customization of operations/endpoints. 
   The progress of the mocks can be paused, the number of requests per second can be increased or decreased, or error conditions or timeouts can be simulated.
3. Optional use of connecting outputs to **web sockets**.
4. Simple customization.
5. Almost pure use of `Deno standard library`. No third-party libraries except `Oak` middleware framework.


###  About technology:
1. `Deno` runtime and `standard library`, `Oak` routes.
2. Long running operations handled by spawning `Web workers` that communicate with each other using `Message channels` and their `ports`. Processes can therefore be influenced at runtime with minimal overhead, unlike JS `Promise`.
3. `Web sockets` for online application output.
4. Simple `JSON`storage.
5.`Typescript` (self explanatory with `Deno`).

### Configuration

1. `config.ts`:

   ```
      config = {
        BROADCAST_WORKER_URL: "./broadcastWorker.ts",
        PROXY_SERVER_URL: "http://localhost",
        PROXY_SERVER_PORT: 8081,
        PROXY_SERVER_MIRROR_PATH: "/mirror",
        CORE_HTTP_SERVER_PORT: 8080,
        STORAGE_JSON: "./src/storage.json",
      };

   ```
`confits.ts` options:

* **BROADCAST_WORKER_URL**: Path to the `broadcast worker`, which is generated in 1..N copies (depending on the number of running operations) to listen to instructions.
* **PROXY_SERVER_URL**: The URL of a `proxy` `HTTP server` used to simulate the target server before a live in-process or configuration test.
* **PROXY_SERVER_PORT**: `Proxy` `HTTP server` port.
* **PROXY_SERVER_MIRROR_PATH**: The address to which the proxy server logs incoming communications.
* **CORE_HTTP_SERVER_PORT**: Application core `HTTP server` port.
* **STORAGE_JSON**: Path to `JSON` storage.


### Usage

```
{
   "options":{
      "useProxy":true,
      "perSec":0.5,
      "request":{
         "count":33,
         "type":"outage",
         "address":{
            "city":"Prague",
            "streets":[
               {
                  "street":"Francouzska",
                  "number":"23"
               },
               {
                  "street":"Italska",
                  "number":"1176"
               }
            ],
            "postalCode":"280 02"
         }
      }
   }
}
```

### TODOs
* readme updates
* graphql schema support
* request catcher
* schema hash support
* tests
* plugins
* CLI version
* web sockets mock
* measuring
* full version (frontend, graphs)
* log storage
* swagger
* kubernetes integration
* docker version
* logo
* blog article
* web snapshot video

### Diagrams

###

<img align="left" width="771" height="541" src="https://drive.google.com/uc?export=view&id=1cTlSpRI8v1KyhAP1rXwDRVieWE4nxDfI">


