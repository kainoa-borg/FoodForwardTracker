import os

ca_path = os.path.join(os.path.dirname(__file__) + '/../DigiCertGlobalRootCA.crt.pem').replace('\\', '/')
print(ca_path)