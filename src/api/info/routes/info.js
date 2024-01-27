module.exports = {
  routes: [
    {
      "method": "GET",
      "path": "/info",
      "handler": "info.show",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/display",
      "handler": "info.display",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/viewer",
      "handler": "info.serveHtmlPage",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/view",
      "handler": "info.view",
      "config": {
        "policies": []
      }
    },
  ],
};
