FROM python:3.10

WORKDIR /app 

COPY . .

ENV GROQ_KEY=${GROQ_KEY}
ENV HF_KEY=${HF_KEY}

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

EXPOSE 5432 5173

RUN apt-get update && \
  python -m ensurepip --upgrade && \
  pip install uv && \
  uv venv .virtualenv  

RUN . .virtualenv/bin/activate && \
  uv sync 


CMD ["/bin/bash", "-c","PYTHONPATH=/app  uv run src/backend/api/main.py "] 




