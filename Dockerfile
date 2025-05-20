FROM squidfunk/mkdocs-material:8.5.11

RUN apk add --update bash jq curl &&\
    pip3 install --upgrade pip mkdocs-macros-plugin mkdocs-glightbox

# Required for the numpy that gets installed when trying to add mkdocs-table-reader-plugin
# See https://stackoverflow.com/questions/33421965/installing-numpy-on-docker-alpine
# RUN apk --no-cache add musl-dev linux-headers g++ &&\
#     pip3 install mkdocs-table-reader-plugin

WORKDIR /docs
EXPOSE 8000
