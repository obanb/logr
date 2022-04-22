run:
	deno run --config tsconfig.json --allow-net --allow-read --allow-write index.ts
test:
	deno test
format:
	deno fmt
debug:
	deno run -A --inspect-brk index.ts
bundle:
	deno bundle index.ts build/index
reload: 
	deno cache --reload index.ts