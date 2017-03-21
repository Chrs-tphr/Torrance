using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

using log4net;

using Woolpert.BusinessObjects.Accela;

namespace Woolpert.ACAModules {

    //http://stackoverflow.com/questions/25015150/understanding-httpmodules-and-url-manipulation

    public class QueryStringModule : IHttpModule {

        private ILog logger = null;

        private string targetUrl;
        IList<string> altIdParameterNames;
        private string id1ParameterName;
        private string id2ParameterName;
        private string id3ParameterName;
        private string moduleParameterName;

        private Woolpert.BusinessObjects.Accela.AccelaEntities dbContext = null;

        public QueryStringModule() {
            
            log4net.Config.XmlConfigurator.Configure();
            this.logger = LogManager.GetLogger(typeof(QueryStringModule));

            this.logger.Debug(String.Format("Enter {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));

            try {
                this.targetUrl = System.Configuration.ConfigurationManager.AppSettings["QueryStringModule:TargetUrl"].ToLower();
                this.altIdParameterNames = System.Configuration.ConfigurationManager.AppSettings["QueryStringModule:AltIdParameterName"].ToLower().Split(',').ToList();
                this.id1ParameterName = System.Configuration.ConfigurationManager.AppSettings["QueryStringModule:Id1ParameterName"].ToLower();
                this.id2ParameterName = System.Configuration.ConfigurationManager.AppSettings["QueryStringModule:Id2ParameterName"].ToLower();
                this.id3ParameterName = System.Configuration.ConfigurationManager.AppSettings["QueryStringModule:Id3ParameterName"].ToLower();
                this.moduleParameterName = System.Configuration.ConfigurationManager.AppSettings["QueryStringModule:ModuleParameterName"].ToLower();
            } catch (Exception ex) {
                this.logger.Fatal(ex);
            }

            this.logger.Debug(String.Format("Exit {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));
        }

        public void Dispose() {
            this.logger.Debug(String.Format("Enter {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));

            if(this.dbContext != null) {
                try {
                    this.dbContext.Dispose();
                } catch {}
            }            

            this.logger.Debug(String.Format("Exit {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));
        }

        public void Init(HttpApplication httpApplication) {
            this.logger.Debug(String.Format("Enter {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));

            httpApplication.BeginRequest += HttpApplication_BeginRequest;

            this.logger.Debug(String.Format("Exit {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));
        }

        private void HttpApplication_BeginRequest(object sender, EventArgs e) {
            this.logger.Debug(String.Format("Enter {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));
                        
            var httpContext = ((HttpApplication)sender).Context;

            var request = httpContext.Request;
            if (request.RawUrl.ToLower().Contains(this.targetUrl)) {

                var queryString = request.QueryString;
                this.logger.Debug(String.Format("queryString:{0}", queryString.ToString()));

                string removeParameterValue = null;

                this.altIdParameterNames.ToList().ForEach(altIdParameterName => {

                    removeParameterValue = queryString[altIdParameterName];

                    if (removeParameterValue != null) {
                        try {

                            this.dbContext = new AccelaEntities();

                            var entity = this.dbContext.B1PERMIT.FirstOrDefault(permit => permit.B1_ALT_ID == removeParameterValue);

                            if (entity != null) {

                                var readOnlyProperty = queryString.GetType().GetProperty("IsReadOnly", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);

                                readOnlyProperty.SetValue(queryString, false, null);

                                queryString.Remove(altIdParameterName);

                                queryString.Add(this.id1ParameterName, entity.B1_PER_ID1);
                                queryString.Add(this.id2ParameterName, entity.B1_PER_ID2);
                                queryString.Add(this.id3ParameterName, entity.B1_PER_ID3);

                                if (queryString[this.moduleParameterName] == null) {
                                    queryString.Add(this.moduleParameterName, entity.B1_MODULE_NAME);
                                }

                                this.logger.Debug(String.Format("queryString:{0}", queryString.ToString()));

                                var path = GetVirtualPath(httpContext);
                                httpContext.RewritePath(path, String.Empty, queryString.ToString());

                                readOnlyProperty.SetValue(queryString, true, null);
                            }

                            this.dbContext.Dispose();

                            return;

                        } catch (Exception ex) {
                            this.logger.Error(ex);
                        }
                    }
                });                
            }            

            this.logger.Debug(String.Format("Exit {0}.{1}()", this.GetType().Name, System.Reflection.MethodInfo.GetCurrentMethod().Name));
        }
        
        private static string GetVirtualPath(HttpContext context) {
            string path = context.Request.RawUrl;
            var queryStringLength = path.IndexOf("?");
            path = path.Substring(0, queryStringLength >= 0 ? queryStringLength : path.Length);
            path = path.Substring(path.LastIndexOf("/") + 1);
            return path;
        }
    }
}
