## App Test

It's an example of Node.js application using express.

## Run local

Install dependencies:
<pre>
npm install
</pre>

Run:
<pre>
npm run dev
</pre>
or
<pre>
node src/index.js
</pre>

## Tests
run:
<pre>
npm run test
</pre>

## Build docker image

Build:
<pre>
docker build -t josecyber/mtls-poc -f Dockerfile .
</pre>

## Run docker image

<pre>
docker run -d --env-file=.env -p8080:8080 josecyber/mtls-poc
</pre>