# Logr 

Logr is a tool for **mocking and measuring web communication**. It allows to simulate both the **active sender side** and the "passive" `API` on the **receiver side**. The tool is primarily intended for local use in development.



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
2. Long running operations handled by spawning Web workers that communicate with each other using `Message channels` and their `ports`. Processes can therefore be influenced at runtime with minimal overhead, unlike JS `Promise`.
3. `Web sockets` for online application output.
4. Simple `JSON`storage.
5.`Typescript` (self explanatory with `Deno`).



<img align="left" width="771" height="541" src="https://drive.google.com/uc?export=view&id=1cTlSpRI8v1KyhAP1rXwDRVieWE4nxDfI">


