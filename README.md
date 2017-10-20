#	Vote OYP

VoteOYP is a program meant to run an election using electronic polling stations over a local network.  

##	Installation
Before installing, [download and install Node.js](https://nodejs.org/en/download/).  
Installation is done by cloning or downloading this repository.  

##	Usage

### Simple
Open a Terminal window to the app's directory and enter `npm start` to begin the server.  
Press `Ctrl-C` to exit and destroy all election information.  

### One Click
After installing, double-click on the **RUN.command** (Mac) or **RUN.exe** (Win) file to start the server.  
a command-line window will open informing you of the ip address of the server and  
the passwords and usernames which you need to connect to VoteOYP.  
To stop the program and destroy all election information, close this window or press `Ctrl-C`.  

### Docker
Open a Terminal window to the **docker** folder.  
generate ssl keys and certs in this structure:  
```
docker/ssl
|- certs
|  |- dhparam.pem
|  |- selfsigned.cert
|- private
|  |- selfsigned.key
```
Enter `docker-compose up -d` to start the server.  
If you do not have custom passwords set in **config/server.json**, enter `docker-compose logs` to list the current passwords.  
Enter `docker-compose stop` (and then optionally, `docker-compose rm`) to stop the server.  

Notes:
Using Docker does not require NodeJs to be installed, but does require Docker to be installed and running.  
When checking the Docker Logs, the 'server is running on...' line will not show the real IP address and should be ignored.  
The Docker setup uses HTTP/2 over standard ports so you can connect to it more easily.  
	For example: if you set your machine's hostname to voteoyp and have mDNS working, you can connect via `https://voteoyp.local`  

## Logs
The Server logs (stdout) will show you your current passwords and username.  
for example, if the output is:  
```
admin username is: oyp_elections
admin password is: 1a2b3c4d5e
ballot username is: oyp_elections
ballot password is: 1234
server is running on 10.0.0.11:8080
```
type `http://10.0.0.11:8080` into your browser to open the ballot page  
then when prompted enter 'oyp_elections' as the username and '1234' as the password.  
type `http://10.0.0.11:8080/setup` to open the administration/setup page  
then when prompted enter the admin username and password.  

##	Configuration
Configuration files can be found in the **config** folder.  
To configure the election process, open **config/election.json**.  
	This lets you: change the accepted election positions, available election systems; and set the elections temporary folder name.
To configure the server, open **config/server.json**.  
	This lets you: change the host, port, and username; and use custom passwords.  

##	Modification
For any modifications this repository: clone it, make your modifications, then create a pull request.  

###	Adding an Election System
If you wish to add an election system, first look at existing election systems under **app/systems/**.  
You will need to put your javascript file in this same directory.  
Your file needs to export a function that takes in the election object (read **app/election.js** for this)  
and returns an array of winning candidates (if two or more candidates are tied: they should all considered winners).  


## Downloading Node
You can get Node directly at [nodejs.org](https://nodejs.org/)  

If you intend to run VoteOYP on a Mac, you can also get Node via Homebrew:  
	Open the Terminal app (Applications/Utilities/Terminal)  
	To install homebrew, Paste in:  
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`  
	To install node, Type/Paste in:  
`brew install node`  

If you have no internet connection and are using MacOS or Windows, you can use the included NODE_INSTALLER.  
Make sure to use the correct installer: '\*.pkg' for Mac, '\*x86.msi' for 32-bit Windows, or '\*x64.msi' for 64-bit Windows.  
