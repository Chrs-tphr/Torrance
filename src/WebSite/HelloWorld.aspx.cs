using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class HelloWorld : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        System.Diagnostics.Debug.WriteLine(String.Format("Enter {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));

        System.Diagnostics.Debug.WriteLine(String.Format("Request.QueryString:{0}", Request.QueryString));
        
        System.Diagnostics.Debug.WriteLine(String.Format("Exit {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));
    }
}