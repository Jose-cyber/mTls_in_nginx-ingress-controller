# Mutual TLS over kubernetes/nginx ingress controller

Requirements:
* openssl
* kind
* docker



## Create a kind cluster:
Apply the code below:
```
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```

## Install nginx in cluster:

<pre>
kubectl --namespace ingress-nginx apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
</pre>

## Deploy the app

Create namespace to app:
<pre>
kubectl create ns app
</pre>


Deploy the app:
<pre>
kubectl apply -f k8s/app/app-deploy.yaml
</pre>


## Add ssl in ingress

Generate certificate using openssl:
<pre>
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj “/CN=test.localdev.me/O=test.localdev.me”
</pre>

Let's create an secret file using the keys:
<pre>
kubectl create secret tls localdev-tls --key server.key --cert server.crt
</pre>

Apply ingress file:
<pre>
kubectl apply -f k8s/ingress/app-in-no-mtls.yaml
</pre>

It work's 

![](./img/it-works.png)


# Add mTLS in ingress

First let’s create CA “Certificate Authority” cert to be used as our verification gate to the client requests:
<pre>
openssl req -x509 -sha256 -newkey rsa:4096 -keyout ca.key -out ca.crt -days 356 -nodes -subj '/CN=My Cert Authority'
</pre>

Then apply the CA as secret to kubernetes cluster
<pre>
kubectl create secret generic ca-secret --from-file=ca.crt=ca.crt
</pre>

Next we need to generate a client **Cert Signing Request** and client key:
<pre>
openssl req -new -newkey rsa:4096 -keyout client.key -out client.csr -nodes -subj '/CN=My Client'
</pre>

Now we need to sign this CSR “Certificate Signing Request” with the CA to generate the client certificate **which can be used to call the endpoint**:
<pre>
openssl x509 -req -sha256 -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 02 -out client.crt
</pre>

Finally apply the ingress ingress resource to add client verification annotations, one of them is to refer to the CA secret “default/ca-secret” which is our verification authority:

use the command:
<pre>
kubectl apply -f k8s/ingress/app-in-with-mtls.yaml
</pre>

and we can see that it works:

![](./img/mtls-applied.png)


Let's teste call using the certificate

<pre>
curl -k https://test.localdev.me/ --key client.key --cert client.crt
</pre>

It work's:

![](./img/mtls-1.png)

and we can see the status code is equal 200:

![](./img//mtls-2.png)