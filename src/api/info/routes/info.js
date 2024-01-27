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
    }
  ],
};
