#use -iname to match both jpg and JPG
# Next line converts to a version with -small appended and avoids recomputing
#for i in `find . -type f ! -iname "*-thumb.jpg" ! -iname "*-small.jpg" -iname "*.jpg"`; do echo $i; if [ -f ${i%.*}-small.jpg ]; then echo "skipped" & continue; fi; convert $i -auto-orient -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace RGB ${i%.*}-small.jpg; done

# Next line always tries to compress all images in place
for i in `find . -type f ! -iname "*-thumb.jpg" ! -iname "*-small.jpg" -iname "*.jpg"`; do echo $i; convert $i -auto-orient -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace RGB ${i%.*}.jpg; done
