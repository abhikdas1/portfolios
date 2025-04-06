#!/bin/bash

# Create placeholder images for Template 3
mkdir -p /workspaces/portfolios/template-3/assets

# Create basic placeholder images
convert -size 400x500 gradient:#6C63FF-#3D5A80 \
  -gravity center -pointsize 30 -fill white -annotate 0 "Profile Image" \
  /workspaces/portfolios/template-3/assets/profile-placeholder.jpg

convert -size 350x450 gradient:#EE6C4D-#3D5A80 \
  -gravity center -pointsize 24 -fill white -annotate 0 "About Image 1" \
  /workspaces/portfolios/template-3/assets/about-placeholder-1.jpg

convert -size 250x300 gradient:#98C1D9-#3D5A80 \
  -gravity center -pointsize 20 -fill white -annotate 0 "About Image 2" \
  /workspaces/portfolios/template-3/assets/about-placeholder-2.jpg

# Create project placeholders
for i in {1..4}; do
  convert -size 350x250 gradient:#3D5A80-#98C1D9 \
    -gravity center -pointsize 24 -fill white -annotate 0 "Project $i" \
    /workspaces/portfolios/template-3/assets/project-placeholder-$i.jpg
done

# Create skill images
convert -size 500x350 gradient:#EE6C4D-#3D5A80 \
  -gravity center -pointsize 30 -fill white -annotate 0 "Design Skills" \
  /workspaces/portfolios/template-3/assets/skill-design.jpg

convert -size 500x350 gradient:#3D5A80-#98C1D9 \
  -gravity center -pointsize 30 -fill white -annotate 0 "Frontend Skills" \
  /workspaces/portfolios/template-3/assets/skill-frontend.jpg

convert -size 500x350 gradient:#98C1D9-#EE6C4D \
  -gravity center -pointsize 30 -fill white -annotate 0 "Backend Skills" \
  /workspaces/portfolios/template-3/assets/skill-backend.jpg

convert -size 500x350 gradient:#293241-#98C1D9 \
  -gravity center -pointsize 30 -fill white -annotate 0 "Tools & Workflow" \
  /workspaces/portfolios/template-3/assets/skill-tools.jpg

# Create testimonial images
for i in {1..3}; do
  convert -size 100x100 xc:skyblue -gravity center -pointsize 20 -fill navy -annotate 0 "Client $i" \
    -vignette 0x8 -format circle \
    /workspaces/portfolios/template-3/assets/testimonial-placeholder-$i.jpg
done

echo "All placeholder images have been created."
