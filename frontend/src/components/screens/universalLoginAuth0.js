<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Sign In with Auth0</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
  <style>
    body, html {
      height: 100%;
      /*background-color: #f9f9f9;*/
      background-image: url("https://i.ibb.co/ZhHmGf0/flexcel-Background-Full.png");
      min-height: 100%;
      min-width: 100%;
      background-repeat: no-repeat;
      background-position: center center;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    }

    .login-container {
      position: relative;
      height: 100%;
    }

    .login-box {
      position: absolute;
      top: 53%;
      left: 32%;
      transform: translateY(-50%);
      padding: 15px;
      background-color: #000;
      box-shadow: 0px 5px 5px #ccc;
      border-radius: 5px;
      border-top: 1px solid #e9e9e9;
    }

    .login-header {
      text-align: center;
    }

    .login-header img {
      width: 75px;
    }
    
    .login-text {
    	color: #fff
    }

    #error-message {
      display: none;
      white-space: break-spaces;
    }
  </style>
<body>
  <div class="login-container">
    <div class="col-xs-12 col-sm-4 col-sm-offset-4 login-box">
      <div class="login-header">
        <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg"/>
        <h3 class="login-text">Welcome</h3>
        <h5 class="login-text">PLEASE LOG IN</h5>
      </div>
      <div id="error-message" class="alert alert-danger"></div>
      <form onsubmit="return false;" method="post">
        <div class="form-group">
         <label class="login-text" for="name">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label class="login-text" for="name">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter your password">
        </div>
        <div class="captcha-container form-group"></div>
        <button
          type="submit"
          id="btn-login"
          class="btn btn-primary btn-block">
            Log In
        </button>
        <button
          type="button"
          id="btn-signup"
          class="btn btn-default btn-block">
            Sign Up
        </button>
        <hr>
        <button
          type="button"
          id="btn-google"
          class="btn btn-default btn-danger btn-block">
            Log In with Google
        </button>
      </form>
    </div>
  </div>

  <!--[if IE 8]>
  <script src="//cdnjs.cloudflare.com/ajax/libs/ie8/0.2.5/ie8.js"></script>
  <![endif]-->

  <!--[if lte IE 9]>
  <script src="https://cdn.auth0.com/js/polyfills/1.0/base64.min.js"></script>
  <script src="https://cdn.auth0.com/js/polyfills/1.0/es5-shim.min.js"></script>
  <![endif]-->

  <script src="https://cdn.auth0.com/js/auth0/9.16/auth0.min.js"></script>
  <script src="https://cdn.auth0.com/js/polyfills/1.0/object-assign.min.js"></script>
  <script>
    window.addEventListener('load', function() {

      var config = JSON.parse(
        decodeURIComponent(escape(window.atob('@@config@@')))
      );

      var leeway = config.internalOptions.leeway;
      if (leeway) {
        var convertedLeeway = parseInt(leeway);
      
        if (!isNaN(convertedLeeway)) {
          config.internalOptions.leeway = convertedLeeway;
        }
      }

      var params = Object.assign({
        overrides: {
          __tenant: config.auth0Tenant,
          __token_issuer: config.authorizationServer.issuer
        },
        domain: config.auth0Domain,
        clientID: config.clientID,
        redirectUri: config.callbackURL,
        responseType: 'code'
      }, config.internalOptions);

      var webAuth = new auth0.WebAuth(params);
      var databaseConnection = 'Username-Password-Authentication';
      var captcha = webAuth.renderCaptcha(
        document.querySelector('.captcha-container')
      );

      function login(e) {
        e.preventDefault();
        var button = this;
        var username = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        button.disabled = true;
        webAuth.login({
          realm: databaseConnection,
          username: username,
          password: password,
          captcha: captcha.getValue()
        }, function(err) {
          if (err) displayError(err);
          button.disabled = false;
        });
      }

      function signup() {
        var button = this;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        button.disabled = true;
        webAuth.redirect.signupAndLogin({
          connection: databaseConnection,
          email: email,
          password: password,
          captcha: captcha.getValue()
        }, function(err) {
          if (err) displayError(err);
          button.disabled = false;
        });
      }

      function loginWithGoogle() {
        webAuth.authorize({
          connection: 'google-oauth2'
        }, function(err) {
          if (err) displayError(err);
        });
      }

      function displayError(err) {
        captcha.reload();
        var errorMessage = document.getElementById('error-message');
        errorMessage.innerHTML = err.policy || err.description;
        errorMessage.style.display = 'block';
      }

      document.getElementById('btn-login').addEventListener('click', login);
      document.getElementById('btn-google').addEventListener('click', loginWithGoogle);
      document.getElementById('btn-signup').addEventListener('click', signup);
    });
  </script>
</body>
</html>
