#!/bin/sh
sudo apt-get install python-dev; 
sudo apt-get install libxml2-dev; 
sudo apt-get libxslt-dev;
sudo apt-get install python-glpk;
wget http://ftp.gnu.org/gnu/glpk/glpk-4.47.tar.gz;
tar -xzvf glpk-4.47.tar.gz;
cd glpk-4.47;
./configure;
sudo make install;
cd ..;
wget http://tfinley.net/software/pyglpk/pyglpk-0.3.tar.bz2;
tar -xjvf pyglpk-0.3.tar.bz2; 
cd pyglpk-0.3;
make;
make install;
