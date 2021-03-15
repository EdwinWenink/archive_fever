#!/bin/bash

# Run this script from website root directory
cd Notes/Zettelkasten # Git submodule maintained elsewhere

OUTPUT="../../content/zettelkasten"
FILTER_LOC="C://Users/Edwin Wenink/Documents/pandoc-filters/canonify"

echo $(pwd)
echo "Processing /content/zettelkasten/*"
for file in *.md
do
    echo $file
    # TODO figure out if there's a good default location for filters
    # Or do they need to be in /usr/bin?
    # And make it work crossplatform
    pandoc --lua-filter="$FILTER_LOC/canonify.lua" $file -t markdown -o $OUTPUT/$file || exit
done

