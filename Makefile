.PHONY: build
build:
	make solver/build
	make client/install
	make client/build

client/%:
	(cd client; make $*)

solver/%:
	(cd solver; make $*)
