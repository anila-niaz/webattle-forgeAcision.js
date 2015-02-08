var API_KEY; //Enter you API key here

var ForgeConnectionManager = function(socket, serializer){
    var acisionSDK;
    var onlinePlayers;

    var self = this;
    var loginButton, loginForm, userDisplay, sendMessageButton, messages;

    initializeElements();

    function initializeElements(){
        loginForm = document.getElementById('login-form');
        userDisplay = document.getElementById('user');
        messages = document.getElementById('messages');

        loginButton = document.getElementById('login-submit');
        sendMessageButton = document.getElementById('message-submit');

        loginButton.addEventListener('click', function(){
            self.connect();
        }, false);

        sendMessageButton.addEventListener('click', function(){
            self.sendMessage();
        }, false);
    }

    this.connect = function(){
        var username = document.getElementById('username').value ;
        var password = document.getElementById('password').value;

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
            listenToIncomingMessages();

            socket.send(serializer.serialize(serializer.MSG_NEW_PLAYER, {
                    name: username
                }
            ));

            function updateElements(){
                loginForm.className += ' hide';
                userDisplay.innerHTML = '<span>Hello ' + username + '!</span>';
            }

            function listenToIncomingMessages(){
                if(!acisionSDK)
                    return;

                acisionSDK.messaging.setCallbacks({
                    onMessage: function(msg) {
                        messages.value += '\n' + msg.from + ': ' + msg.content;
                    }
                });
            }
        }
        function onConnectionFailure(){
            console.warn('Authentication failed');
        }
    };

    this.updatePlayers = function(data){
        onlinePlayers = data;
    };

    this.sendMessage = function(){
        var message = document.getElementById('message').value ;
        if(message.length > 0)
            acisionSDK.messaging.sendToDestinations(onlinePlayers, message, {
                from: acisionSDK.getAddress().split('@')[0]
            }, {
                onAcknowledged: function(msgid){
                    console.log('message sent');
                }
            });
    };
};