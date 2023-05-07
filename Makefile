DOCS_VOLUME="${PWD}:/docs"
PORT=8000


deps:
	@pip3 install -r requirements.txt

dockerbuild:
	@docker build --platform linux/arm64/v8 -t eukota.com/docs:latest .

serve:
	@docker run --rm=true \
		-p $(PORT):8000 \
		-v $(DOCS_VOLUME) \
		eukota.com/docs:latest
