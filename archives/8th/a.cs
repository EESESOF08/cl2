using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

class Program
{
    static Hashtable contentTypes = new Hashtable {
            { ".html", "text/html" }, { ".js", "text/javascript" }, { ".css", "text/css" },
            { ".pdf", "application/pdf" }, { ".xlsx", "application/vnd.ms-execl" },
            { ".jpg", "image/jpeg" }, { ".png", "image/png" }, { ".zip", "application/zip" },
            { ".ico", "mage/vnd.microsoft.icon" }, { ".mp4", "video/mp4" }
    };

    public static void Main(string[] args)
    {
        string url = "http://localhost:8080"; // Change the URL as needed
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add(url + "/");
        listener.Start();
        Console.WriteLine("Listening for incoming requests..." + url);

        while (true)
        {
            HttpListenerContext  context = listener.GetContext();
            HttpListenerRequest  req     = context.Request;
            HttpListenerResponse res     = context.Response;

            string nn = req.QueryString["number"];
            string dt = req.QueryString["date"];

            Console.WriteLine(nn);
            Console.WriteLine(dt);

            if (req.HttpMethod == "GET")
            {

                string pp = (req.Url.AbsolutePath == "/") ? "index.html" : req.Url.AbsolutePath.Remove(0, 1);
                string ff = Path.Combine(Directory.GetCurrentDirectory(), pp);

                if (File.Exists(ff)) { 

                    string ht = File.ReadAllText(ff);
                    byte[] bu = Encoding.UTF8.GetBytes(ht);
                    res.ContentLength64 = bu.Length;

                    string ex = Path.GetExtension(pp);
                    res.ContentType = Program.contentTypes[ex] as string;
                    res.OutputStream.Write(bu, 0, bu.Length);
                    res.Close();
                    continue;

                }
            }

						if (req.HttpMethod == "GET" && req.Url.AbsolutePath == "/restore")
            {
                try { 

                    string di = Path.Combine(Directory.GetCurrentDirectory(), "rec", nn); 
                    //Console.WriteLine("GET /resume");
                    Console.WriteLine("dir:");
                    Console.WriteLine(di);
                    string pa = Path.Combine(di, dt + ".json");
                    Console.WriteLine(pa);

                        string x = String.Format("{0}_*.json", dt);
                    Console.WriteLine("pattern:");
                        Console.WriteLine(x);
                    string[] files = Directory.GetFiles(di, x);
                    Console.WriteLine(files.Length);

                    if (files.Length > 0) {

                        Array.Sort(files, (x1, y1) => y1.CompareTo(x1));

                        pa = files[0];
                        Console.WriteLine(pa);
    
                        if (File.Exists(files[0])) {
        
                            string rd = File.ReadAllText(pa);
                            byte[] bu = Encoding.UTF8.GetBytes(rd);
            
                            res.ContentType = "application/json";
                            res.ContentLength64 = bu.Length;
                            res.OutputStream.Write(bu, 0, bu.Length);
                            res.Close();
                            continue;
                        }
                    }
                } catch(Exception e) {
                    Console.WriteLine(e);
                    byte[] bb = Encoding.UTF8.GetBytes("Saving into the file has failed.");
                    res.ContentLength64 = bb.Length;
                    res.OutputStream.Write(bb, 0, bb.Length);
                    res.Close();
                    continue;
                }

            }

            Console.WriteLine("22");
            Console.WriteLine(req.Url.AbsolutePath);

            if (req.HttpMethod == "POST" && req.Url.AbsolutePath == "/save")
            {

                Console.WriteLine("nn:");
                Console.WriteLine(nn);
                Console.WriteLine("POST save");

                byte[] bb;

                try {

                    using (Stream body = req.InputStream) {

                        StreamReader reader = new StreamReader(body, req.ContentEncoding);
                        string jso = reader.ReadToEnd();
                        Console.WriteLine(jso);
   
                        string di = Path.Combine(Directory.GetCurrentDirectory(), "rec", nn); 

                        if (!Directory.Exists(di))
                            Directory.CreateDirectory(di);

                        string nm = String.Format("{0}_{1}.json", dt, DateTime.Now.ToString("yyyyMMddHHmmss"));

                        string pa = Path.Combine(di, nm);
                        Console.WriteLine(pa);
                        File.WriteAllText(pa, jso);
    
                    }
    
                    bb = Encoding.UTF8.GetBytes("JSON data received and saved.");

                } catch(Exception e) {
                    Console.WriteLine(e);
                    bb = Encoding.UTF8.GetBytes("Savng into the file has failed.");
                }

                res.ContentLength64 = bb.Length;
                res.OutputStream.Write(bb, 0, bb.Length);
                res.Close();
                continue;

            }

            res.StatusCode = (int)HttpStatusCode.NotFound;
            res.Close();
        }
    }

    static string Filename(string number, string date_string) {
      return Path.Combine(number, date_string);
    }
}
