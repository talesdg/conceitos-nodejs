const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeRepositoryId(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).send();
  }
  return next();
}

function findIndexRepository(request,response,next){
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  if(repositoryIndex < 0 ){
    return response.status(400).send();
  }
  return next();
}

app.use("/repositories/:id",validadeRepositoryId,findIndexRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like",findIndexRepository, (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(repo => repo.id === id);
  
  repository.likes +=1;
  return response.json(repository);
});

module.exports = app;
