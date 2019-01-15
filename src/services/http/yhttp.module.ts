// General XMLHttpRequest module
// Author : Yeo Sung Jun


export class YHttp{

  public method:string;
  public url:string;
  public status: number;
  public response: string;
  public data: FormData;

  public ConErr:Function;
  public ServErr:Function;
  public AuthErr:Function;
  public Complete:Function;

  constructor(method, url) {
    this.method = method;
    this.url = url;
  }

  public send(data?:FormData, header?:{key:string, value:string}) {
      let xhttp = new XMLHttpRequest;
      xhttp.open(this.method, this.url, true);
      if(header) {
        xhttp.setRequestHeader(header.key, header.value);
      }

      xhttp.withCredentials = false; //For passportjs authentificate

      xhttp.onreadystatechange = () => {
        this.status = xhttp.status;
        xhttp.onerror=() => {
            this.ConErr();
        }

        xhttp.onload=() => {
          this.status = xhttp.status;
          if(xhttp.status >= 200 && xhttp.status <= 300 || xhttp.status == 304 || xhttp.status == 302) {
            this.response = xhttp.response;
            this.Complete() ;
          } else if (xhttp.status == 401 || xhttp.status == 402 ){
            this.AuthErr();
          } else {
            this.ServErr();
          }
        }
      }

      if(data) {
        xhttp.send(data);
      } else {
        xhttp.send();
      }
  }
}
