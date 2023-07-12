# Chatbot

The chatbot has been deployed using Flask , Javascript and NLP.

# Setup

Clone repo and create a virtual environment 
```
$ git clone https://github.com/sourav282/Chatbot.git

$ cd chatbot-deployment

$ python3 -m venv venv

$ . venv/bin/activate
```
Install all requierd Packages(in virtual environment)
```
$ (venv) pip install Flask torch torchvision nltk
```
```
$ (venv) python
>>> import nltk
>>> nltk.download('punkt')
```
# Run in virtual environment

```
$ (venv) train.py

$ (venv) chat.py

$ (venv) app.py


```
