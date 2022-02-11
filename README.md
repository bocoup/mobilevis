# MobileV.is App

[MobileV.is](http://mobilev.is) is a collection of data visualization examples, specifically the way
in which they appear on mobile devices.

http://MobileV.is is an actual website you can visit.

This respository represents the back-end and front-end code for the example gallery
portion of this project. The pattern collection is located in another repo that you
can find here: http://github.com/bocoup/mobilevis-patterns.

## About this app:

This application is a node.js application. It uses postgres for a database, and utilizes
twitter authentication and s3 for storing image files. As such, there's a bit of
setup required to get this app working on your machine, if you choose to do so. If
you're working with @iros, ping her for the relevant credentials, otherwise follow
the pre-dev setup instructions

## Pre-dev setup:

1. Set up an s3 bucket on amazon and make sure you have your keys.
2. Set up a twitter application with read only permissions. You will need to provide a
URL that twitter will authorize - this can be anything as we will map it in your etc hosts.
For example, we will use _mobilevis.yourapp.com_ for the rest of this README.
3. Install VirtualBox and Vagrant (>1.6.2).

## Dev Setup

In order to work on MobileVis, you will need to have Vagrant installed. We use it
extensively to try and simplify the amount of dependencies you would need to install
on your development machine. Once Vagrant is setup on your machine, proceed to follow
these instructions:

1. Clone this repo: `git clone git@github.com:bocoup/mobilevis`
2. Create an `api/config/s3.js` file based on the `s3.js.sample` file in that folder.
3. Create an `api/config/twitter.js` file nased on the `twitter.js.sample` file in that folder.
4. Create a `deploy/shared/keys/aws_config` based on the `aws_config.sample` file in that folder.
5. Update your `/etc/hosts` file to add the line `192.168.33.30 mobilevis.yourapp.com` (or
which ever domain you chose in pre-dev step #2.)
6. Start the machine setup by running `vagrant up dev` from the root. This will provision
the new development machine - it will take a while.
7. When the set up is complete, ssh into your machine by running `vagrant ssh dev`. The following instructions
are within that shell:

8. On the virtual machine, your application code appears in the `/vagrant` folder - this
folder is actually the _same_ folder as your development machine's mobilevis folder; they
are sharing it. So, any changes inside your mobilevis folder will automatically be reflected
in that `/vagrant/` folder. Run `cd /vagrant` to operate within it.

9. Run `npm install` - note we are doing this in the VM and NOT in the host, because our VM
is a ubuntu box. If you are working on any other operating system, you might not build the
correct bindings, and so we want to make sure the correct builds take place. This does mean
that you will most likely only be able to run the app from the VM.

10. Run `grunt build` to actually build our source files into a runnable mobilevis
application. Do this from the VM shell as well.

11. Restart the mobilevis server `sudo restart mobilevis`.

You should now be able to visit mobilevis.yourapp.com in your browser and see mobilevis
running. If you do not, proceed to troubleshooting section.

## Troubleshooting

Because MobileVis isn't just a static app, there are a few things we need to keep
an eye on:

### Is Postgres running?

If you load the app but don't see your examples, your database might be down.

Try to run:

`ps aux | grep postgres`

If you see something like this:

`postgres  1416  0.0  2.7 127900 10140 ?        S    Jun08   0:04 /usr/lib/postgresql/9.1/bin/postgres -D /var/lib/postgresql/9.1/main -c config_file=/etc/postgresql/9.1/main/postgresql.conf`

Then, all is good. Otherwise, you need to run postgres by calling:

`sudo service postgresql restart`

### Is nginx running?

If you navigate to the website, but don't see mobilevis running or in general
don't even see any response from the server, your nginx web server might be down.

Try to run:

`ps aux | grep nginx`

If you see something like this:

`root      1565  0.0  0.3  62788  1380 ?        Ss   Jun08   0:00 nginx: master process /usr/sbin/nginx`

Then you need to just restart mobilevis by running:

`sudo restart mobilevis`

If you see an error that there is no known instance, it means mobilevis wasn't running,
then run `sudo start mobilevis`.

If you don't see anything resulting from that grep command, restart nginx:

`sudo service nginx restart`

If you STILL don't see mobilevis, then there may not be a link between the nginx
configuration for mobilevis. Run:

```
sudo ln -s /vagrant/deploy/dev/nginx/mobilevis.conf /etc/nginx/conf.d/mobilevis.conf
sudo (re)start mobilevis
sudo service nginx restart
```

### Is MobileVis running?

If you get a message saying something along the lines of "welcome to nginx" then
it's likely MobileVis isn't running. To start it, run:

`sudo start mobilevis`

### None of the above worked, now what?

All the logs for the application as well as nginx go into `/vagrant/logs`. The
application log itself is called `upstart-mobilevis.log` - you probably want to look
there to see if there are any exceptions.

# Contact

If you have more questions, contact [@ireneros](http://twitter.com/ireneros) or email irene at bocoup.com.
Please open tickets if you experience any issues.
