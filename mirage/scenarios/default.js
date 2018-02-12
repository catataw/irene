/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function(server) {
  var userCount = getRandomInt(3, 5),
    pricingCount = getRandomInt(3, 3),
    planCount = getRandomInt(3, 3),
    subscriptionCount = getRandomInt(1, 1),
    statCount = getRandomInt(1, 1),
    vulnerabilityCount = getRandomInt(5, 15),
    submissionCount = getRandomInt(3,3),
    personalTokenCount = getRandomInt(3,3),
    invitationCount = getRandomInt(1,1),
    teamCount = 3,
    projectCount = 0, project = null, file = null, projectIds = [],
    team = null, manualscan=null, currentUserId = 1, deviceCount=30, invoiceCount=3;
  var users = server.createList('user', userCount);
  server.createList('pricing', pricingCount);
  server.createList('plan', planCount);
  server.createList('subscription', subscriptionCount);
  server.createList('vulnerability', vulnerabilityCount);
  server.createList('submission', submissionCount);
  server.createList('device', deviceCount);
  server.createList('invoice', invoiceCount);
  server.createList('stat', statCount);
  server.createList('personaltoken', personalTokenCount);
  server.createList('invitation', invitationCount);
  projectCount =  getRandomInt(4, 5);
  for (var teamId = 1; teamId <= teamCount; teamId++) {
    team = server.create('team', {users: users});
  }
  for (var projectId = 1; projectId <= projectCount; projectId++) {
    projectIds.push(projectId);
    var fileCount = getRandomInt(1,4);
    project = server.create('project', {userId: currentUserId});
    server.create('invitation', {projectId: projectId, userId:currentUserId});
    var fileIds = [];
    for (var fileId = 1; fileId <= fileCount; fileId++) {
      file = server.create('file', {projectId: projectId});
      manualscan = server.create('manualscan', {projectId: projectId});
      fileIds.push(file.id);
      for (var vulnerabilityId = 1; vulnerabilityId <= vulnerabilityCount; vulnerabilityId++) {
        server.create('analysis', {file: file, vulnerabilityId: vulnerabilityId});
      }
    }
    project.fileIds = fileIds;
    var collaborationCount = getRandomInt(0, userCount);
    var collaborationIds = [];
    for (var i = 0; i < collaborationCount; i++) {
      teamId = getRandomInt(1, teamCount);
      var collaboration = server.create('collaboration', {projectId: projectId, teamId: teamId});
      collaborationIds.push(collaboration.id);
    }
    project.collaborationIds = collaborationIds;
  }
  var currentUser = server.db.users.get(currentUserId);
  currentUser.projectIds = projectIds;
}
