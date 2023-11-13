using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        string url = "http://localhost:8080"; // Change the URL as needed
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add(url + "/");
        listener.Start();
        Console.WriteLine("Listening for incoming requests...");

        while (true)
        {
            HttpListenerContext context = await listener.GetContextAsync();
            HttpListenerRequest request = context.Request;
            HttpListenerResponse response = context.Response;

            if (request.HttpMethod == "POST" && request.Url.AbsolutePath == "/receive-json")
            {
                // Handle POST requests as before
                using (Stream body = request.InputStream)
                {
                    Encoding encoding = request.ContentEncoding;
                    StreamReader reader = new StreamReader(body, encoding);
                    string json = reader.ReadToEnd();

                    // Save the received JSON data to a file
                    File.WriteAllText("received.json", json);
                }

                byte[] responseBytes = Encoding.UTF8.GetBytes("JSON data received and saved.");
                response.ContentLength64 = responseBytes.Length;
                response.OutputStream.Write(responseBytes, 0, responseBytes.Length);
                response.Close();
            }
            else if (request.HttpMethod == "GET" && request.Url.AbsolutePath == "/data")
            {
                // Handle GET requests at /data and respond with JSON data
                string jsonData = "{\"message\": \"Hello from the server!\"}";
                byte[] buffer = Encoding.UTF8.GetBytes(jsonData);

                response.ContentType = "application/json";
                response.ContentLength64 = buffer.Length;
                response.OutputStream.Write(buffer, 0, buffer.Length);
                response.Close();
            }
            else if (request.HttpMethod == "GET" && request.Url.AbsolutePath == "/")
            {
                // Serve a sample HTML file for GET requests to the root path
                string html = File.ReadAllText("index.html");

                byte[] buffer = Encoding.UTF8.GetBytes(html);
                response.ContentLength64 = buffer.Length;
                response.ContentType = "text/html";
                response.OutputStream.Write(buffer, 0, buffer.Length);
                response.Close();
            }
            else
            {
                // Handle other requests or return a 404 Not Found response
                response.StatusCode = (int)HttpStatusCode.NotFound;
                response.Close();
            }
        }
    }
}
