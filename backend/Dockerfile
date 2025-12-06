FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y netcat-openbsd

COPY . .

ENV FLASK_APP=wsgi.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1 

ENTRYPOINT ["./wait_for_db.sh"]


CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]
