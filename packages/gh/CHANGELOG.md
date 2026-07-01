## [2.6.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.5.1...@api-hooks/gh@2.6.0) (2026-07-01)

### Features

* add mutation options support to useGhAddCommitComment hook ([c60c3b1](https://github.com/ElJijuna/api-hooks/commit/c60c3b17eb5b923692d34f8199acc1310eed780d))
* add mutation options support to useGhAddGistComment hook ([3214671](https://github.com/ElJijuna/api-hooks/commit/3214671b0939cdd8765e462409a6092501f34189))
* add mutation options support to useGhAddIssueComment hook ([2c31111](https://github.com/ElJijuna/api-hooks/commit/2c3111131f109c6891e6e38b0972b5992488134f))
* add mutation options support to useGhAddPullRequestComment hook ([96a2e92](https://github.com/ElJijuna/api-hooks/commit/96a2e9271d4fdef9f60e8ee49018469195aa46e9))
* add mutation options support to useGhCancelWorkflowRun hook ([f07abf0](https://github.com/ElJijuna/api-hooks/commit/f07abf01347776614cc3f1f38caa1b4dd9e1e5f7))
* add mutationOptions support to useGhCreateCommitStatus hook ([71ce447](https://github.com/ElJijuna/api-hooks/commit/71ce447582c7c99e8852d88e656bd16bd27e9a40))
* add mutationOptions support to useGhCreateFork hook ([1ee2b49](https://github.com/ElJijuna/api-hooks/commit/1ee2b49b9345a4949a0c0ddbf30a9677d2b3e206))
* add mutationOptions support to useGhCreateGist hook ([51a18c6](https://github.com/ElJijuna/api-hooks/commit/51a18c6a88b472de69dfb8dd0b1f12dab1203519))
* add mutationOptions support to useGhCreateIssue hook ([bafdb15](https://github.com/ElJijuna/api-hooks/commit/bafdb158d3f029afeb8a2c685e2ad1b69efc6146))
* add mutationOptions support to useGhCreateLabel hook ([e54d065](https://github.com/ElJijuna/api-hooks/commit/e54d06544c5b09129665d6d0617f51bfe370ff53))
* add mutationOptions support to useGhCreateMilestone hook ([8cee88e](https://github.com/ElJijuna/api-hooks/commit/8cee88e93cbe8664c663f627bf4251e750a029c0))
* add mutationOptions support to useGhCreateOrgRepo hook ([f9bbdb0](https://github.com/ElJijuna/api-hooks/commit/f9bbdb000d295df5bb416daf2ac5bfc49bcac516))
* add mutationOptions support to useGhCreatePullRequestReview hook ([e70bc6c](https://github.com/ElJijuna/api-hooks/commit/e70bc6c089fd3c7b15aea899beb229bc8a594e0f))
* add mutationOptions support to useGhCreateRelease hook ([44e94ce](https://github.com/ElJijuna/api-hooks/commit/44e94ce07e5d737c5baf0311994c551e86427d6d))
* add mutationOptions support to useGhCreateRepoAdvisory hook ([da4553b](https://github.com/ElJijuna/api-hooks/commit/da4553bb96ea11686e1fc52a3c080ef20239896d))
* add mutationOptions support to useGhCreateRepoWebhook hook ([fa7bbcf](https://github.com/ElJijuna/api-hooks/commit/fa7bbcf0a8de5a41eb017b2ba07134a3f90cac1b))
* add mutationOptions support to useGhDeleteGist hook ([466f5e3](https://github.com/ElJijuna/api-hooks/commit/466f5e3a63ec64d1db7383536b4ee7cb5c29b3d7))
* add mutationOptions support to useGhDeleteGistComment hook ([f0f378a](https://github.com/ElJijuna/api-hooks/commit/f0f378a52b0c62e2487863f30ba58f2e932d3375))
* add mutationOptions support to useGhDeleteLabel hook ([1c109b2](https://github.com/ElJijuna/api-hooks/commit/1c109b20a67d49735d8e7f820d809270f293aeb9))
* add mutationOptions support to useGhDeleteMilestone hook ([59319db](https://github.com/ElJijuna/api-hooks/commit/59319db81be184efd62ee3433ece6234c2c05019))
* add mutationOptions support to useGhDeleteRelease hook ([f027820](https://github.com/ElJijuna/api-hooks/commit/f027820a49aab3b21e67630032d0c9b855fcfcce))
* add mutationOptions support to useGhDeleteRepoWebhook hook ([c085c77](https://github.com/ElJijuna/api-hooks/commit/c085c772db50ec5bdc46211305bfe60b19b2e189))
* add mutationOptions support to useGhForkGist hook ([5f8ff19](https://github.com/ElJijuna/api-hooks/commit/5f8ff192d4ff2fe9067625b3d2841848d67126b8))
* add mutationOptions support to useGhMarkAllNotificationsRead hook ([3b31ff0](https://github.com/ElJijuna/api-hooks/commit/3b31ff06ebaef0d2bedd4f1d3fa02e3885f43ca1))
* add mutationOptions support to useGhMarkNotificationRead hook ([6ae1379](https://github.com/ElJijuna/api-hooks/commit/6ae137997887009627d6e332383de46d1de734a5))
* add mutationOptions support to useGhMergePullRequest hook ([f5d0d04](https://github.com/ElJijuna/api-hooks/commit/f5d0d04953bc6a56719084829db40e3e06cd3ed9))
* add mutationOptions support to useGhRemoveCollaborator hook ([f043fe6](https://github.com/ElJijuna/api-hooks/commit/f043fe6e5a8ae787fbfebd05df5e4e56111fd48a))
* add mutationOptions support to useGhRequestRepoAdvisoryCve hook ([9574175](https://github.com/ElJijuna/api-hooks/commit/95741750c499f2225bc6d64ea5100dc3bd532422))
* add mutationOptions support to useGhRequestReviewers hook and its tests ([da45708](https://github.com/ElJijuna/api-hooks/commit/da457087bddc1e6214a838fa4260bcf5ad0d0286))
* add mutationOptions support to useGhStarGist hook ([d1c26c2](https://github.com/ElJijuna/api-hooks/commit/d1c26c225f42386a669eceb73a94036d3a9b1d50))
* add mutationOptions support to useGhTriggerWorkflow hook and its tests ([7eb7a60](https://github.com/ElJijuna/api-hooks/commit/7eb7a60c914a9e8dd50098e015ed14f84ed569f6))
* add mutationOptions support to useGhUnstarGist hook and its tests ([799b032](https://github.com/ElJijuna/api-hooks/commit/799b0323e64d8cb19becdea50e130204a7785e57))
* add mutationOptions support to useGhUpdateGist hook and its tests ([5fe502b](https://github.com/ElJijuna/api-hooks/commit/5fe502b05607e87e76b63b7412519dafd0b3842b))
* add mutationOptions support to useGhUpdateGistComment hook and its tests ([d1e49ca](https://github.com/ElJijuna/api-hooks/commit/d1e49ca9f4677631e92789d587bc84021a812bb3))
* add mutationOptions support to useGhUpdateIssue hook and its tests ([5b5ff98](https://github.com/ElJijuna/api-hooks/commit/5b5ff98963f1788a727c6315833e9fb0c45db14c))
* add mutationOptions support to useGhUpdateLabel hook and its tests ([9b26411](https://github.com/ElJijuna/api-hooks/commit/9b264112c24308287f4a3252f8c84021c951ec61))
* add mutationOptions support to useGhUpdateMilestone hook and its tests ([3afc68d](https://github.com/ElJijuna/api-hooks/commit/3afc68dbc9df438ebbf20a2e21f71f2f514fd79b))
* add mutationOptions support to useGhUpdatePullRequest hook and its tests ([ec6a7c1](https://github.com/ElJijuna/api-hooks/commit/ec6a7c1bf2cfa9cf10ef1a3d374119b6f2c6e871))
* add mutationOptions support to useGhUpdateRelease hook and its tests ([81beea8](https://github.com/ElJijuna/api-hooks/commit/81beea877bb57f43d716d742e374b18b863e1a3b))
* add mutationOptions support to useGhUpdateRepoAdvisory hook and its tests ([00979eb](https://github.com/ElJijuna/api-hooks/commit/00979ebf0e1ccc8449c3a5b31051e5d9ee291d4b))
* add mutationOptions support to useGhUpdateRepoWebhook hook and its tests ([5ca92e5](https://github.com/ElJijuna/api-hooks/commit/5ca92e5496f7696dab41e4aa541d7298a3109b32))
* add queryOptions support to useGhAdvisoriesInfinite and useGhAdvisory hooks ([2426923](https://github.com/ElJijuna/api-hooks/commit/24269233d649841f4fd6ee8ca8ae35148186e515))
* add queryOptions support to useGhAdvisoryByCve hook ([c09381e](https://github.com/ElJijuna/api-hooks/commit/c09381e4af0377211756238bd70bdf3082381aca))
* add queryOptions support to useGhCommitCheckRuns hook ([37ce8af](https://github.com/ElJijuna/api-hooks/commit/37ce8af7f401832b4e52167a3cd1e8b343daa4a9))
* add queryOptions support to useGhCommitCombinedStatus hook ([31207a5](https://github.com/ElJijuna/api-hooks/commit/31207a5eca4102640d0cc6b1e91f17ab0d17ad18))
* add queryOptions support to useGhCommitComments hook ([2a62a27](https://github.com/ElJijuna/api-hooks/commit/2a62a2772a6d729b5262d599ba119841fffecb15))
* add queryOptions support to useGhCommitCommentsInfinite hook ([1419f95](https://github.com/ElJijuna/api-hooks/commit/1419f9591855149a753e9a02b4e7df01f114f97e))
* add queryOptions support to useGhCommitStatuses hook ([6c34f9f](https://github.com/ElJijuna/api-hooks/commit/6c34f9f6b9dfaf8856074b9ba5b7b95789ff21df))
* add queryOptions support to useGhCurrentUser hook ([2371a06](https://github.com/ElJijuna/api-hooks/commit/2371a067871c159b7740445bb5f415bcf2ae7ee6))
* add queryOptions support to useGhGist hook ([d865528](https://github.com/ElJijuna/api-hooks/commit/d865528a7545d9d9a9c15101633d0086a839cfeb))
* add queryOptions support to useGhGistComments hook ([2cfa342](https://github.com/ElJijuna/api-hooks/commit/2cfa342c0e00039108063149dc5fb1603b3e8555))
* add queryOptions support to useGhGistCommentsInfinite hook and its tests ([af2a763](https://github.com/ElJijuna/api-hooks/commit/af2a7638a357b02b13e0de560560e8d8f1898473))
* add queryOptions support to useGhGistCommits hook ([80393f4](https://github.com/ElJijuna/api-hooks/commit/80393f4401024aa76833b7a01aa8f935aaedaca1))
* add queryOptions support to useGhGistCommitsInfinite and its tests ([c2dae30](https://github.com/ElJijuna/api-hooks/commit/c2dae30952b14654b18709bd79badef1b609153a))
* add queryOptions support to useGhGistForks hook ([2cd4d59](https://github.com/ElJijuna/api-hooks/commit/2cd4d59102fb4c12a67121486505dcd2a6b090a0))
* add queryOptions support to useGhGistForksInfinite hook and its tests ([08f29e9](https://github.com/ElJijuna/api-hooks/commit/08f29e92dcdcb1738c07ec5f26f014279833cade))
* add queryOptions support to useGhGistIsStarred hook and its tests ([e85a412](https://github.com/ElJijuna/api-hooks/commit/e85a4126124bea916c4ca4cc9c1febb195d5efe2))
* add queryOptions support to useGhGists hook ([7ff16aa](https://github.com/ElJijuna/api-hooks/commit/7ff16aa76c6f91cc1513d62b670a47617edd9407))
* add queryOptions support to useGhGistsInfinite hook and its tests ([99a22a8](https://github.com/ElJijuna/api-hooks/commit/99a22a8de7c015288c062fc4c748507b1288205e))
* add queryOptions support to useGhGraphql hook and its tests ([a1b1f76](https://github.com/ElJijuna/api-hooks/commit/a1b1f76ff55ff4dd75723206ce7bb161312f3596))
* add queryOptions support to useGhIssue hook ([c302c0a](https://github.com/ElJijuna/api-hooks/commit/c302c0add47f8e0087115c4034efb4a976328323))
* add queryOptions support to useGhIssueComments hook ([426e8f5](https://github.com/ElJijuna/api-hooks/commit/426e8f55065a2e8a223b542040a9d10b871673dd))
* add queryOptions support to useGhIssueCommentsInfinite hook and its tests ([7a50fe6](https://github.com/ElJijuna/api-hooks/commit/7a50fe6276b708fce73bf5e957146c8609b3d7e6))
* add queryOptions support to useGhIssues hook ([a9b36ee](https://github.com/ElJijuna/api-hooks/commit/a9b36eeb61e3032f9f7057089fd4dd19c928d1ec))
* add queryOptions support to useGhIssuesInfinite hook ([c022ae0](https://github.com/ElJijuna/api-hooks/commit/c022ae01e79276acce3bcdacfb1e61e15c4823d9))
* add queryOptions support to useGhNotifications hook ([af46653](https://github.com/ElJijuna/api-hooks/commit/af4665347ab31df8a4c720e3f30d3a10d4f6bbd7))
* add queryOptions support to useGhNotificationsInfinite hook ([a7ddc97](https://github.com/ElJijuna/api-hooks/commit/a7ddc971e0375049e949d12e6a1f03f72a22c92d))
* add queryOptions support to useGhOrg hook ([daccc6e](https://github.com/ElJijuna/api-hooks/commit/daccc6e978de875a6feb092d2711e18e7ecdb49e))
* add queryOptions support to useGhOrgMembers hook ([20c2f4a](https://github.com/ElJijuna/api-hooks/commit/20c2f4ac1d0898fee5912084ac8a82187c35f563))
* add queryOptions support to useGhOrgMembersInfinite hook and its tests ([e0f5143](https://github.com/ElJijuna/api-hooks/commit/e0f51435a5686b1d2e2d7df5b2d9361918b96eea))
* add queryOptions support to useGhOrgRepos hook ([bc11ca9](https://github.com/ElJijuna/api-hooks/commit/bc11ca9bba37fc23f3388b7fec3108003d063704))
* add queryOptions support to useGhOrgReposInfinite hook and its tests ([ced8fae](https://github.com/ElJijuna/api-hooks/commit/ced8fae9143bd2a6944395f9f7acd9cee00e8f01))
* add queryOptions support to useGhPullRequest hook ([4d5a9af](https://github.com/ElJijuna/api-hooks/commit/4d5a9af3b5ca864845c602e679a71fb65680fb22))
* add queryOptions support to useGhPullRequestCommits hook ([822832e](https://github.com/ElJijuna/api-hooks/commit/822832eddb40d1d60b56dd549094cbdabbce1fb7))
* add queryOptions support to useGhPullRequestFiles hook ([aa5bcc1](https://github.com/ElJijuna/api-hooks/commit/aa5bcc1d1b3ad4b52d830c96d40ed76623719586))
* add queryOptions support to useGhPullRequestIsMerged hook and its tests ([6c4e195](https://github.com/ElJijuna/api-hooks/commit/6c4e1953fa2f8e636596a6293c83fb4502dcafd0))
* add queryOptions support to useGhPullRequestReviewComments hook ([614de9e](https://github.com/ElJijuna/api-hooks/commit/614de9ea7a55469055c620b86d650997a7183852))
* add queryOptions support to useGhPullRequestReviews hook ([59fb5dc](https://github.com/ElJijuna/api-hooks/commit/59fb5dca616af3c0ccab3905dcfc582088aa97ce))
* add queryOptions support to useGhRepo hook ([89679bf](https://github.com/ElJijuna/api-hooks/commit/89679bf1455e451f9399800965901bd0c0c25119))
* add queryOptions support to useGhRepoAdvisories hook ([46c425a](https://github.com/ElJijuna/api-hooks/commit/46c425a151a28674af92548782af4214473ee81d))
* add queryOptions support to useGhRepoAdvisory hook ([d5166e4](https://github.com/ElJijuna/api-hooks/commit/d5166e4ff4fdb1c4a0a9b1220c88e0f57edece42))
* add queryOptions support to useGhRepoBranch hook ([2fc9a3a](https://github.com/ElJijuna/api-hooks/commit/2fc9a3a9f29ca31bb9188bee9a7e533d58546334))
* add queryOptions support to useGhRepoBranches hook ([b56a27f](https://github.com/ElJijuna/api-hooks/commit/b56a27fec13ea0078478183dbace8ead65faa035))
* add queryOptions support to useGhRepoBranchesInfinite hook and its tests ([fef2c83](https://github.com/ElJijuna/api-hooks/commit/fef2c83f17532b312ac8a5140d7b40ae80ccb155))
* add queryOptions support to useGhRepoCommits hook ([1694ab0](https://github.com/ElJijuna/api-hooks/commit/1694ab0b07a657401b7e3e78b34d4401dc3827ce))
* add queryOptions support to useGhRepoCommitsInfinite hook and its tests ([7fcdff8](https://github.com/ElJijuna/api-hooks/commit/7fcdff8fd957e7a0d1425f3761f206cef8bd0bfe))
* add queryOptions support to useGhRepoContents hook ([22b0752](https://github.com/ElJijuna/api-hooks/commit/22b0752460504594ade868d21f7c437e2ef7ffb6))
* add queryOptions support to useGhRepoContributors hook ([8839e1f](https://github.com/ElJijuna/api-hooks/commit/8839e1fc73ced50a2ff486d5f397a6c9dd444786))
* add queryOptions support to useGhRepoContributorsInfinite hook and its tests ([83c4e14](https://github.com/ElJijuna/api-hooks/commit/83c4e1445582f14c805a705a46a28449b1dc80a9))
* add queryOptions support to useGhRepoForks hook ([68e0aec](https://github.com/ElJijuna/api-hooks/commit/68e0aecbd77cd75cf3c171ec85a16e9356d0ef2e))
* add queryOptions support to useGhRepoForksInfinite hook and its tests ([e350413](https://github.com/ElJijuna/api-hooks/commit/e3504133a7c8780a3d025128f347aeb7bbe7ec32))
* add queryOptions support to useGhRepoGitTree hook ([f8e31e7](https://github.com/ElJijuna/api-hooks/commit/f8e31e7f59a99bb3b3bd7af7fd8c5af74839024b))
* add queryOptions support to useGhRepoIssues hook ([72dc906](https://github.com/ElJijuna/api-hooks/commit/72dc90614c63e952d68ef958663fbea6803c5acb))
* add queryOptions support to useGhRepoIssuesInfinite hook and its tests ([f711028](https://github.com/ElJijuna/api-hooks/commit/f71102826c71686cb49bb888ed57059e4836ced1))
* add queryOptions support to useGhRepoLanguages hook ([7a6f762](https://github.com/ElJijuna/api-hooks/commit/7a6f7627b0d7f62b0d6a05667fc4a93f3c28f77c))
* add queryOptions support to useGhRepoLatestRelease hook ([a4a001d](https://github.com/ElJijuna/api-hooks/commit/a4a001dc4977215f5646713668214a30dcb67099))
* add queryOptions support to useGhRepoMultipleRaw hook ([3161bff](https://github.com/ElJijuna/api-hooks/commit/3161bff679f316b6a9ece6199f18198a2a4fec1f))
* add queryOptions support to useGhRepoPullRequests hook ([330ec60](https://github.com/ElJijuna/api-hooks/commit/330ec6045d09c861ec9d52d1ac7aa75cbad7ae31))
* add queryOptions support to useGhRepoPullRequestsInfinite hook and its tests ([37fcf78](https://github.com/ElJijuna/api-hooks/commit/37fcf78b024dd5f3da768323c5fa0a0ef475057d))
* add queryOptions support to useGhRepoRaw hook ([1d3c082](https://github.com/ElJijuna/api-hooks/commit/1d3c082176d5d2faaf2cb09f961a37d96dc7217a))
* add queryOptions support to useGhRepoReleases hook ([9129142](https://github.com/ElJijuna/api-hooks/commit/9129142eedba2b1cb54d593c81c8b19c1682648d))
* add queryOptions support to useGhRepoReleasesInfinite hook and its tests ([9407d5b](https://github.com/ElJijuna/api-hooks/commit/9407d5b27ca238acc0d6d214676a7404e34976fb))
* add queryOptions support to useGhRepoTags hook ([2345f6b](https://github.com/ElJijuna/api-hooks/commit/2345f6b017d9ffec99bcfceaf90c6b65ecdc5e37))
* add queryOptions support to useGhRepoTagsInfinite hook and its tests ([39cd6de](https://github.com/ElJijuna/api-hooks/commit/39cd6def940745a86436cc6017fa858c58b91685))
* add queryOptions support to useGhRepoTopics hook ([9b779a6](https://github.com/ElJijuna/api-hooks/commit/9b779a68d66a4db1268a8610bcf7dcda78276860))
* add queryOptions support to useGhRepoWebhooks hook ([f935a0a](https://github.com/ElJijuna/api-hooks/commit/f935a0a0a364096e6821893e83aa0522b08dbef1))
* add queryOptions support to useGhRepoWebhooksInfinite hook and its tests ([fe28928](https://github.com/ElJijuna/api-hooks/commit/fe289288a174c7db9bbfeb03aad5e043daf26929))
* add queryOptions support to useGhRepoWorkflowRun hook ([a6f14f6](https://github.com/ElJijuna/api-hooks/commit/a6f14f6604604afafcc215140980b61f03a12d8e))
* add queryOptions support to useGhRepoWorkflowRuns hook ([59db120](https://github.com/ElJijuna/api-hooks/commit/59db120fad3b07c78ccb3a18eb128760ba9fe788))
* add queryOptions support to useGhRepoWorkflowRunsInfinite hook ([4369f83](https://github.com/ElJijuna/api-hooks/commit/4369f83b0e3a1c447c617bdfa7764d418d801cb5))
* add queryOptions support to useGhRepoWorkflows hook and its tests ([fa9b073](https://github.com/ElJijuna/api-hooks/commit/fa9b0739218a132dc1675fd1b457794c22735b9d))
* add queryOptions support to useGhRepoWorkflowsInfinite hook ([8c161bf](https://github.com/ElJijuna/api-hooks/commit/8c161bfa62c2ea49f7f37be47f3b93dc51111822))
* add queryOptions support to useGhSearchCode hook ([d50af48](https://github.com/ElJijuna/api-hooks/commit/d50af48b62287302750121e863e4125d16c6856b))
* add queryOptions support to useGhSearchCodeInfinite hook and its tests ([6322283](https://github.com/ElJijuna/api-hooks/commit/63222831c7b9181b1d9eb8a431430149a955f21b))
* add queryOptions support to useGhSearchIssues hook ([ecb05e6](https://github.com/ElJijuna/api-hooks/commit/ecb05e6c528ad1e55c4fb1d45b94f15cb5ffab48))
* add queryOptions support to useGhSearchIssuesInfinite hook and its tests ([d606307](https://github.com/ElJijuna/api-hooks/commit/d606307dfeea94565e297c0be2541e9bedbc170e))
* add queryOptions support to useGhSearchRepos hook and its tests ([19b0b8c](https://github.com/ElJijuna/api-hooks/commit/19b0b8c540e6d8c30975b608e63433d6fe82e522))
* add queryOptions support to useGhSearchReposInfinite hook and its tests ([b2af1f7](https://github.com/ElJijuna/api-hooks/commit/b2af1f7dad22b63fd8219181f4360fdb48bf0bac))
* add queryOptions support to useGhSearchUsers hook and its tests ([68a111d](https://github.com/ElJijuna/api-hooks/commit/68a111d3d1c4ce495326b70c05ff37202ae57c57))
* add queryOptions support to useGhSearchUsersInfinite hook and its tests ([288c20b](https://github.com/ElJijuna/api-hooks/commit/288c20b37ba98619079905319371f9fb15ec45f3))
* add queryOptions support to useGhUser hook and its tests ([2e5d8c1](https://github.com/ElJijuna/api-hooks/commit/2e5d8c1c4a5527ffb8b00756c86f22cefa111fb7))
* add queryOptions support to useGhUserCommitContributionsByRepo hook and its tests ([ef9e107](https://github.com/ElJijuna/api-hooks/commit/ef9e1074d538608ace4627eab4409e0748b2a904))
* add queryOptions support to useGhUserContributionMap hook and its tests ([477660a](https://github.com/ElJijuna/api-hooks/commit/477660af1f83b9052ae4343abb98e7193c294030))
* add queryOptions support to useGhUserFollowers hook and its tests ([e55b30a](https://github.com/ElJijuna/api-hooks/commit/e55b30a49e0877b5fe81bcc56ba29c1148a010b9))
* add queryOptions support to useGhUserFollowersInfinite hook and its tests ([37e55a3](https://github.com/ElJijuna/api-hooks/commit/37e55a30bd3925c8f8914507428fd62dff0148c0))
* add queryOptions support to useGhUserFollowing hook ([a2e820f](https://github.com/ElJijuna/api-hooks/commit/a2e820fc1108f1d489ef9dbbadcbe3482b393020))
* add queryOptions support to useGhUserFollowingInfinite hook and its tests ([07574bf](https://github.com/ElJijuna/api-hooks/commit/07574bf4e56f1aa7da9968b09ccbf429e09ed20e))
* add queryOptions support to useGhUserIssueContributionsByRepo hook and its tests ([92482e0](https://github.com/ElJijuna/api-hooks/commit/92482e073fe8b968aa14aa7a45cb2487169f1797))
* add queryOptions support to useGhUserOrganizations hook and its tests ([f3a83a0](https://github.com/ElJijuna/api-hooks/commit/f3a83a016aaa69389459c0b521980e04e20f409f))
* add queryOptions support to useGhUserOrganizationsInfinite hook and its tests ([02e2aa8](https://github.com/ElJijuna/api-hooks/commit/02e2aa893c49767da059c45a19b52164c12f5b30))
* add queryOptions support to useGhUserOrganizationsInfinite hook and its tests ([f67e508](https://github.com/ElJijuna/api-hooks/commit/f67e50838c41cef05bdb71cb13ddd1783007e56a))
* add queryOptions support to useGhUserPinnedItems hook and its tests ([585ae29](https://github.com/ElJijuna/api-hooks/commit/585ae2907aa16657bcf15db2d55d4638c08a968f))
* add queryOptions support to useGhUserPrContributionsByRepo hook and its tests ([cc93233](https://github.com/ElJijuna/api-hooks/commit/cc9323371da71258d182b6128ca34c371e4f8737))
* add queryOptions support to useGhUserPublicEvents hook and its tests ([f6db285](https://github.com/ElJijuna/api-hooks/commit/f6db285a17d8c7bfbe1e9c9c07c98678af294fbd))
* add queryOptions support to useGhUserRepos hook and its tests ([3854ef8](https://github.com/ElJijuna/api-hooks/commit/3854ef86271bc80f28b87a247faa39afaf881c40))
* add queryOptions support to useGhUserReposInfinite hook and its tests ([2b9327e](https://github.com/ElJijuna/api-hooks/commit/2b9327e411e851938b2d29e9e4b0a5551488bc8d))
* add queryOptions support to useGhUserSocialAccounts hook ([68102d6](https://github.com/ElJijuna/api-hooks/commit/68102d642e8f9b3dc14bca5e8fa98d335babb429))
* add support for mutation options in useGhAddCollaborator hook ([79b2b85](https://github.com/ElJijuna/api-hooks/commit/79b2b85ec4b6319fc02b17236f0fe3c49b814e60))
* add support for queryOptions in useGhAdvisories hook ([69b9d4a](https://github.com/ElJijuna/api-hooks/commit/69b9d4a3063ec0b1b85b8c36c8e6d209d7cd0141))
* add support for queryOptions in useGhCommit hook ([8403cf8](https://github.com/ElJijuna/api-hooks/commit/8403cf8b46f90003db275f72b93f1622e1bf0a0e))
* define hook-specific option types for queries and mutations ([7d8d02e](https://github.com/ElJijuna/api-hooks/commit/7d8d02e8c56c7ca2dacad81a2421f1ef06c821cb))

### Refactoring

* update tests to improve readability and maintainability ([d3d659d](https://github.com/ElJijuna/api-hooks/commit/d3d659d04fe565c06bb601e2ce5667ea147cd4f0))

## [2.5.1](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.5.0...@api-hooks/gh@2.5.1) (2026-06-08)

### Refactoring

* update ReactNode type imports in test hooks to improve consistency and clarity ([a77a513](https://github.com/ElJijuna/api-hooks/commit/a77a5135ab444dc35b7faf4b23871164d690d982))

## [2.3.1](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.3.0...@api-hooks/gh@2.3.1) (2026-06-02)

### Bug Fixes

* **@api-hooks/gh:** update gh-api-client dependency ([20d4f9d](https://github.com/ElJijuna/api-hooks/commit/20d4f9d9e07cd839836062a420e238dcbb9af229))

## [2.3.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.2.0...@api-hooks/gh@2.3.0) (2026-05-26)

### Features

* **@api-hooks/gh:** add new hooks keys ([9050cf7](https://github.com/ElJijuna/api-hooks/commit/9050cf73ea777c0e3a16dbadb33dad41a73e2636))
* **@api-hooks/gh:** implement hooks for gh-api-client v1.16.0 ([c62838e](https://github.com/ElJijuna/api-hooks/commit/c62838e7fb8b2656452e94a84f0de2b08978a65a))

## [2.2.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.1.0...@api-hooks/gh@2.2.0) (2026-05-24)

### Features

* **@api-hooks/gh:** add hooks for gh-api-client ([fd602b7](https://github.com/ElJijuna/api-hooks/commit/fd602b7c111dc587b56a2b18ac0eb055bc0071cd))

## [2.1.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.0.0...@api-hooks/gh@2.1.0) (2026-05-23)

### Features

* **@api-hooks/gh:** add hook useGhRepoMultipleRaw ([e29f39c](https://github.com/ElJijuna/api-hooks/commit/e29f39cc41eb314247734de5119736363ca00a08))

## [2.0.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.14.0...@api-hooks/gh@2.0.0) (2026-05-20)

### ⚠ BREAKING CHANGES

* **@api-hooks/gh:** the `token` option has been removed from all hooks. Configure
authentication once via GhClientProvider at the app root instead.

- Add GhClientProvider and useGhClient() context following the NpmClientContext pattern
- Refactor all 99 hooks to use useGhClient() instead of per-hook token+useMemo
- Add useGhNotifications and useGhNotificationsInfinite
- Add useGhMarkNotificationRead and useGhMarkAllNotificationsRead mutations
- Add useGhIssues and useGhIssuesInfinite (cross-repository, GET /issues)
- Add useGhSearchIssues and useGhSearchIssuesInfinite
- Add useGhRepoWorkflowRuns and useGhRepoWorkflowRunsInfinite
- Update README with GhClientProvider setup and new hook documentation

### Features

* **@api-hooks/gh:** add GhClientProvider context and hooks for notifications, issues, search, and workflow runs ([1682038](https://github.com/ElJijuna/api-hooks/commit/1682038e2cf5b5e394155d0c72bf73a39232f88a))

## [1.14.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.13.0...@api-hooks/gh@1.14.0) (2026-05-13)

### Features

* **@api-hooks/gh:** add hooks for gist, user, repo, PR and commit sub-operations ([c035814](https://github.com/ElJijuna/api-hooks/commit/c03581496acf430ffddb6dcaa9615dedfff0c3fa))
### Documentation

* update READMEs in base gh and npm ([7a36718](https://github.com/ElJijuna/api-hooks/commit/7a36718069d90b00de80e1961da2f63be3dc4cf3))

## [1.13.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.12.0...@api-hooks/gh@1.13.0) (2026-05-12)

### Features

* **@api-hooks/gh:** add global advisory hooks (advisories, advisory, advisoryByCve) ([9277173](https://github.com/ElJijuna/api-hooks/commit/9277173f75b5b325a0a391c1a0b0a57959054b1b))
* **@api-hooks/gh:** add repo, issue, PR, commit, org and search hooks ([39e1774](https://github.com/ElJijuna/api-hooks/commit/39e1774c9bb9ef8cd8d4b1af79fb9ab8568d97ad))
* **@api-hooks/gh:** add useGhGistsInfinite hook ([41072f2](https://github.com/ElJijuna/api-hooks/commit/41072f2a6092b27faa34a15eedb15a54997e4544))
### Documentation

* add documentation in hooks. ([deb3aa5](https://github.com/ElJijuna/api-hooks/commit/deb3aa5e9c5471207d48a839cba45f6619b6ed0e))
* update READMEs ([e258e4e](https://github.com/ElJijuna/api-hooks/commit/e258e4e8d81ad883f092e66709fcebeda8ee950f))

## [1.8.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.4...@api-hooks/gh@1.8.0) (2026-04-18)

### Features

* add useGhGists in @api-hooks/gh (closes [#56](https://github.com/ElJijuna/api-hooks/issues/56)) ([4d84035](https://github.com/ElJijuna/api-hooks/commit/4d84035098260a0e88b816766fae0d808611bbca))

## [1.7.4](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.3...@api-hooks/gh@1.7.4) (2026-04-18)

### Bug Fixes

* move gh-api-client to dependencies. ([ba072a3](https://github.com/ElJijuna/api-hooks/commit/ba072a314f004c6325bbcd8cceb17d9bcc883ec4))

## [1.7.3](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.2...@api-hooks/gh@1.7.3) (2026-04-18)

### Bug Fixes

* add token prop in Gist hooks to use in application, pending others hooks. ([faa2f67](https://github.com/ElJijuna/api-hooks/commit/faa2f67e4e338736950bbd72e1b6ec97221defd9))

## [1.7.2](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.1...@api-hooks/gh@1.7.2) (2026-04-18)

### Bug Fixes

* update workflow to publish api-hooks ([755ad65](https://github.com/ElJijuna/api-hooks/commit/755ad659bb80b7f811738e987a8ecbef6a659dd8))

## [1.7.1](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.0...@api-hooks/gh@1.7.1) (2026-04-18)

### Bug Fixes

* update main and exports in packages jsons from all packages. ([e7c3dc7](https://github.com/ElJijuna/api-hooks/commit/e7c3dc77cc979e958a6798c6216bf6ae8a36833a))

## [1.6.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.5.0...@api-hooks/gh@1.6.0) (2026-04-17)

### Features

* **@api-hooks/gh:** add useGhCreateGist mutation hook (closes [#62](https://github.com/ElJijuna/api-hooks/issues/62)) ([16b61b2](https://github.com/ElJijuna/api-hooks/commit/16b61b23572696348d767f9ac1b395734b6afa40))
* **@api-hooks/gh:** add useGhDeleteGist mutation hook (closes [#64](https://github.com/ElJijuna/api-hooks/issues/64)) ([51462ef](https://github.com/ElJijuna/api-hooks/commit/51462ef3d7d36381a30faa7699b1e6f394fadc1d))
* **@api-hooks/gh:** add useGhGist hook (closes [#57](https://github.com/ElJijuna/api-hooks/issues/57)) ([34c0421](https://github.com/ElJijuna/api-hooks/commit/34c042124c6ad9e1fb5703e72422ff6d6ce55f6f))
* **@api-hooks/gh:** add useGhUpdateGist mutation hook closes [#63](https://github.com/ElJijuna/api-hooks/issues/63) ([4f22e79](https://github.com/ElJijuna/api-hooks/commit/4f22e79edf021c99a7bb4e74bcfba19b377291e4))

### Documentation

* update README and ROADMAP. ([5e443a9](https://github.com/ElJijuna/api-hooks/commit/5e443a9d5b637b85a2070cd7dc74e4c2a94f0796))

## [1.5.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.4.0...@api-hooks/gh@1.5.0) (2026-04-17)

### Features

* add typedoc, update .gitignore and add .npmignore per package ([#55](https://github.com/ElJijuna/api-hooks/issues/55)) ([8b65d57](https://github.com/ElJijuna/api-hooks/commit/8b65d577d7afdf8a99079088c0f7347d5662e18e))

### Documentation

* add README ([8cd657c](https://github.com/ElJijuna/api-hooks/commit/8cd657c4f1c09361e3b8ae7755eac716455c5740))

## [1.4.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.3.0...@api-hooks/gh@1.4.0) (2026-04-17)

### Features

* implement useBpPackageVersionSize ([#49](https://github.com/ElJijuna/api-hooks/issues/49)) ([9b56796](https://github.com/ElJijuna/api-hooks/commit/9b56796d793e9441dccf2932517a3c95a519ee93))

## [1.3.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.2.0...@api-hooks/gh@1.3.0) (2026-04-16)

### Features

* implement useGhUser with signal support ([#19](https://github.com/ElJijuna/api-hooks/issues/19)) ([3f82d7a](https://github.com/ElJijuna/api-hooks/commit/3f82d7a9a5e1a167d17a89b7bf4140411f9d2a22))

## [1.2.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.1.0...@api-hooks/gh@1.2.0) (2026-04-16)

### Features

* implement useNpmMaintainerPackages ([#10](https://github.com/ElJijuna/api-hooks/issues/10)) ([721005d](https://github.com/ElJijuna/api-hooks/commit/721005d10f32831430c9558fcfbf57e0b6044990))
* implement useNpmSearch — completes @api-hooks/npm ([#11](https://github.com/ElJijuna/api-hooks/issues/11)) ([019709e](https://github.com/ElJijuna/api-hooks/commit/019709e16775d5539e5e24df113c4b1c8e401871))

### Documentation

* add REAME. ([1a1bc01](https://github.com/ElJijuna/api-hooks/commit/1a1bc01b74cef019c3bdf9fcf050a89b9a056e19))

## [1.1.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.0.0...@api-hooks/gh@1.1.0) (2026-04-16)

### Features

* implement useNpmMaintainer ([#9](https://github.com/ElJijuna/api-hooks/issues/9)) ([14cf2f4](https://github.com/ElJijuna/api-hooks/commit/14cf2f4412022312c181591d880f05ac016397b8))
