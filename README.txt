This application requires pip. It is recommended to use a virtualenv setup, though it is not required.
To install dependencies, type "pip install -r requirements.txt"
Start the local app server by typing "python app.py" and then navigate to "localhost:5000" in your browser.



Backend Installation (works on 32 bit ubuntu):
  Basic Dependencies:
    apt-get install python-dev libxml2-dev libxslt-dev python-glpk
    #Note python-glpk is not a dependency but seems to install some unlisted required dependency
    
  GLPK:
    Download GLPK v.4.47 from: http://ftp.gnu.org/gnu/glpk/
    Unzip the TAR file (tar -xzvf glpk-4.47.tar.gz)
    ./configure
    sudo make install
  
  GMP (Might not be necessary?):
    Download latest version from: https://gmplib.org/#DOWNLOAD
    Unzip the TAR file
    ./configure
    sudo make install
    
    
  PyGLPK
    Download latest version from: http://tfinley.net/software/pyglpk/download.html
    Unzip the tar file
    make
    make install
    
    
    
