# jpg -> Kan ik {jpg, JPG}
for i in `find . -type f ! -iname "*-thumb.jpg" -iname "*.jpg"`; do echo $i; if [ -f ${i%.*}-thumb.jpg ]; then echo "skipped" & continue; fi; convert $i -auto-orient -thumbnail x300 ${i%.*}-thumb.jpg; done

# Repeat for JPG
#for i in `find . -type f ! -name "*-thumb.JPG" -name "*.JPG"`; do echo $i; if [ -f ${i%.*}-thumb.JPG ]; then echo "skipped" & continue; fi; convert $i -auto-orient -thumbnail x300 ${i%.*}-thumb.JPG; done

# static/images/gallery
