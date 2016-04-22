var system = require('system');
var page   = require('webpage').create();
var url    = system.args[1];
var delay    = isNumeric(system.args[2]) ? parseFloat(system.args[2]) : 1;

// command line is phantomjs hello.js http://www.example.com 1 > index.html. Use a larger value (15000-20000) for pages that don't render nicely

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    // uncomment to log into the console 
    // console.error(msgStack.join('\n'));
};



function onPageReady() {
    var htmlContent = page.evaluate(function () {
        return document.documentElement.outerHTML;
    });

    console.log(htmlContent);

    phantom.exit();
}

// there is an alternative way of doing it with http://phantomjs.org/api/webpage/handler/on-load-finished.html but shitty asynch scripts load after page load is sent



page.open(url, function(status) {

  function checkReadyState() {
    setTimeout(function() {
      var readyState = page.evaluate(function() {
        return document.readyState;
      });

      if ("complete" === readyState) {
        onPageReady();
      } else {
        checkReadyState();
      }
    },delay);
  }

  checkReadyState();

});
