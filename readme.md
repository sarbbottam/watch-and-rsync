watch-and-rsync
---

`watch` and `rsync` directories across system

## Usage

```sh
npm i watch-and-rsync -g
watch-and-rsync -o=start -s=path/to/dir/that/needs/to/be/synced -h=remote-host-(name|ip)
```

 ![demo - gif](http://i.imgur.com/2a7ptkn.gif)

## Why?

I work across Mac and Linux.
I am neither a vim nor an emacs pro, and thus code in Mac as the Linux boxes are on demand and has only `ssh` access.
But my run time is in Linux, :sigh: not using docker yet.

So far, I have been using `launchctl` and `.plist` along with a `.sh` to watch a desired directory and sync it across the desired Linux system.

## Why `JavaScript`?

Some how, I managed to get the `launchctl` and `.plist` working, I don't understand it completely.
It's a nightmare when I want to tweak it, thus `JavaScript`, which I comprehend much better.
