var API_KEY; //Enter you API key here

var ForgeConnectionManager = function(socket, serializer){
    var acisionSDK;
    var onlinePlayers;

    var self = this;
    var loginButton, loginForm, userDisplay;

    initializeElements();

    function initializeElements(){
        loginButton = document.getElementById('login-submit');

        loginButton.addEventListener('click', function(){
            self.connect();
        }, false);


        loginForm = document.getElementById("login-form");
        userDisplay = document.getElementById('user');
    }

    this.connect = function(){
        var username = document.getElementById("username").value ;
        var password = document.getElementById("password").value;

        if(username.length <= 0 || password.length <= 0 || !API_KEY)
            return;

        var connectionConfig = {
            username: username,
            password: password,
            persistent: true
        };

        acisionSDK = new AcisionSDK(API_KEY, {
            onConnected: onConnected,
            onAuthFailure: onConnectionFailure
        }, connectionConfig);

        function onConnected(){
            updateElements();

            socket.send(serializer.serialize(serializer.MSG_NEW_PLAYER, {
                    name: username
                }
            ));

            function updateElements(){
                loginForm.className += " hide";
                userDisplay.innerHTML = '<span>Hello ' + username + '!</span>';
            }
        }
        function onConnectionFailure(){
            console.warn("Authentication failed");
        }
    };

    this.updatePlayers = function(data){
        onlinePlayers = data;
        console.log(onlinePlayers);
    };
};