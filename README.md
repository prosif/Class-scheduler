This application requires pip. It is recommended to use a virtualenv setup, though it is not required.
To install dependencies, type "pip install -r requirements.txt"
Start the local app server by typing "python app.py" and then navigate to "localhost:5000" in your browser.

Backend Installation (Now works on 32 and 64 bit unix installations!):  
  Basic Dependencies:  
    apt-get install python-dev libxml2-dev libxslt-dev python-glpk  
    #Note python-glpk is not a dependency but seems to install some unlisted required dependency  
    
  GLPK:  
    Download latest version from: http://ftp.gnu.org/gnu/glpk/ (verified to work with glpk 4.61)  
    Unzip the TAR file (tar -xzvf glpk-4.47.tar.gz)  
    ./configure  
    sudo make install  
    
  GMP (Might not be necessary?):  
    Download latest version from: https://gmplib.org/#DOWNLOAD (verified to work with gmp 6.1.2)  
    Unzip the TAR file  
    ./configure  
    sudo make install  
    
  PyGLPK: 
    Download latest version from: https://github.com/bradfordboyle/pyglpk  
    Unzip the tar file  
    make  
    make install
