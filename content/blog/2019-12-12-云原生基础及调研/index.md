---
title: '云原生基础及调研'
subTitle: '云原生基础及调研'
tags: ['FrontEnd']
date: 2019-11-12T13:09:31+08:00
---

> 本文部分转载于 Cody Chan 在掘金上的文章[云原生基础及调研](https://juejin.im/post/5deda052f265da33942a7631)，有一些个人理解和修改

本文仅用于简单普及，达到的目的是给没接触过或者很少接触过这方面的人一点感觉，阅读起来会比较轻松，作者深知短篇幅文章是不可能真正教会什么的，所以也不会出现 [RTFM](https://en.wikipedia.org/wiki/RTFM) 的内容。

## 概念

提到云原生（Cloud Native）可能部分人会陌生，但是如果说 Serverless 相信很多人就知道了，实际上两者并不等价。Serverless 是一种理念或者服务交付形态，目标是屏蔽硬件和运维细节。

而云原生则是实现此类目标的一种规范以及基础设施。

再进一步，介于 Docker 天然的隔离性和高效等特点，以及 [Kubernetes](https://kubernetes.io/) 成为事实意义上的 [Docker](https://www.docker.com/) 编排标准，凡是见到云原生或者 Serverless 的地方，几乎都可以认为是基于 Docker + Kubernetes 的一种实践。

单个点展开讲太枯燥，索性我们从历史的角度看看为什么会有云原生。

## Docker

先申明下，Docker 是一种容器技术（具体可深入 [namespaces](https://en.wikipedia.org/wiki/Linux_namespaces) 和 [cgroups](https://en.wikipedia.org/wiki/Cgroups)），而不是虚拟化技术，真正的虚拟化比较常见的是 Xen 和 KVM，可能有同学要举手了：老师，那我们经常用的 VirtualBox 和 VMware 算虚拟化么？当然算！不过大多数情况下，它们用在桌面虚拟化领域。不要急着撕，我说的是大多数，而且虚拟化方案也还有很多。

可能大家之前经常遇到这样的场景：为什么在我这可以运行在你那就不行了？为什么刚刚可以运行现在就不行了？最终解决下来，大多是环境不一致导致的问题。这里的环境除了开发环境还包括操作系统。

所以一般给别人代码的时候还需要告诉别人此代码可运行的操作系统版本，所依赖的各种软件的版本，甚至目录、磁盘、内存、CPU 都有要求！

当然这个问题还有更直接的办法，就是把代码跑在虚拟机里，然后打包虚拟机！（不要笑，实际上还真有人这么干）为什么此刻你笑了，因为虚拟机太重了，无论从打包的体积还是运行时占用的资源都太重了。

那有没有轻点的「虚拟机」呢？嗯，如标题，不过我们叫做容器化，特点：

- 进程级别的隔离性；
- 除里面运行的应用本身外几乎不占用宿主资源；
- 结构化的配置文件（Dockerfile）；
- 无状态无副作用（主流方式）；
- 分层的联合文件系统；
- ...

**Docker 让运行环境变得可编程！**

拿一个最近部署 [Sourcegraph](https://github.com/sourcegraph/sourcegraph) 的经历举个栗子，官方有个开发者 [清单](https://github.com/sourcegraph/sourcegraph/blob/master/doc/dev/local_development.md#step-1-install-dependencies)，一堆依赖和环境设置，照着这个部署会爆炸的，好在官方还提供了可快速部署的镜像，就是这么简单：

![Sourcegraph-quickstart.webp](./Sourcegraph-quickstart.webp)

## 微服务

传统的 WEB 应用核心分为业务逻辑、适配器以及 API 或通过 UI 访问的 WEB 界面，这种单体应用比较适合于小项目。

开发简单直接，集中式管理，而且基本不会重复开发，

当然对于互联网公司来说，缺点也是很明显，比如效率、维护、稳定性和拓展性等等。

所以，现在主流的设计一般会采用微服务架构。其思路不是开发一个巨大的单体式应用，而是将应用分解为小的、互相连接的微服务。

每个业务逻辑都被分解为一个 `微服务`，微服务之间通过 `REST API` 通信。一些微服务也会向终端用户或客户端开发 API 接口

微服务这种架构相比传统应用有很多的优点：

- 解决了复杂性问题，将单体应用分解为一组服务
- 只要符合服务 API 契约，每个服务都可以由专注于此服务的团队独立开发，开发人员可以自由选择开发技术。这就意味着开发人员可以采用新技术编写或重构服务
- 微服务架构可以使每个微服务独立部署，更好的 CI、CD
- 微服务架构使得每个服务都可独立扩展

当然微服务也有一些缺点：

- 没有一个统一的标准。
- 微服务的分布式特点带来的复杂性。

> 开发人员需要基于 RPC 或者消息实现微服务之间的调用和通信，而这就使得服务之间的发现、服务调用链的跟踪和质量问题变得的相当棘手。

- 跨服务的更改和依赖，而且在微服务架构中，一个服务故障可能会产生雪崩效用，导致整个系统故障
- 分布式数据库体系和分布式事务
- 微服务架构对测试也带来了很大的挑战。传统的单体 WEB 应用只需测试单一的 `REST API` 即可，而对微服务进行测试，需要启动它依赖的所有其他服务。这种复杂性不可低估。
- 部署困难

> 单体应用可以简单的部署在一组相同的服务器上，然后前端使用负载均衡即可。每个应用都有相同的基础服务地址，例如数据库和消息队列。而微服务由不同的大量服务构成。每种服务可能拥有自己的配置、应用实例数量以及基础服务地址。这里就需要不同的配置、部署、扩展和监控组件。此外，我们还需要服务发现机制，以便服务可以发现与其通信的其他服务的地址。

针对以上问题和挑战，以及如何解决这些痛点可以大致概况为：

- `API Gateway`
- `Service Proxy`
- `Monitor && Logging && Tracing`
- `RPC`
- `Distributed Stroage && Messaging`
- `Server Discovery`、`服务容错（熔断、服务降级、限流）`、`服务部署（Container Define && Image Build）`

你会发现这些其实在 `Docker` 和 `K8s` 里面或多或少已经都实现了，而且各种各样的库也是为了解决这些痛点而生：比如 [GRPC-RPC](https://grpc.io/)、[Enovy-Service Proxy](https://www.envoyproxy.io/)、[Kong-API Gateway](https://github.com/Kong/kong)、[Fluentd](https://www.fluentd.org-Logger/)等等

个人认为可以说正是微服务的流行，促使了这些工具或者库的繁荣

但是这些都没有一个统一的标准

## Kubernetes

> Kubernetes 名字太长，以下简称 K8S，类似的简称形式还有 [很多](https://en.wikipedia.org/wiki/Numeronym)。

Docker 虽然很厉害，但是在成人看来也只是小孩的玩具，稍微大点的公司内部可能服务就多的吓人，特别是 [微服务架构](https://en.wikipedia.org/wiki/Microservices) 盛行后。

Docker 只解决了单个服务的交付问题，一个具备完整形态的应用必然会涉及各种服务依赖，人为组织这些依赖也是会死人的。Docker 把我们从各种跟环境纠缠里解放出来，却让我们陷入了更高维度的服务依赖之间的纠缠。

是个 Docker 用户应该都会想到去解决这个问题，如你所愿，出现了三国争霸的局面：[Docker Swarm](https://docs.docker.com/engine/swarm/)、[Apache Mesos](http://mesos.apache.org/) 和 [Google Kubernetes](https://kubernetes.io/)，一定程度上 K8S 成为了现在主流的 Docker 编排标准。有意思的是 K8S 有舵手之意，而 Docker 有集装箱之意，所以结合下是不是更合理了？

![docker-k8s.webp](./docker-k8s.webp)

更有意思的是，K8S 管理 Docker 的过程也是一层层抽象，并针对抽象出来一些概念：

- [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/)

> 为了解决一组密切相关容器集合的调度，K8S 的最小的调度单位是 Pod，而不是容器，同一个 Pod 里的容器的资源可以互相访问。

- [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

> 为了管理发布、回滚、扩缩容，又在这之上抽象了一个 Deployment，实际上这是我们最直接使用的单元

- [Service](https://kubernetes.io/docs/concepts/services-networking/service/)

> 为了管理负载均衡和调度，又抽象了一个叫 Service

以上概念是 K8S 基本概念，不过我想强调的是这个：**解决复杂问题很多都是在一层层抽象**，这点展开还可以说很多东西。

K8S 做的比较极致的点就是以上所有资源的管理都是通过声明式的配置进行，**K8S 把容器运维变得可编程！**

## Cloud Native

如果要直接在生产环境使用 K8S 基本也可以了，但是：

都知道 Java 后端广泛采用的 Web 框架是 Spring MVC，那可是 02 年的老古董了！即使现在有了 Spring Boot，也可以算是一种升级，跟近几年百花齐放的前端三大框架比少了太多的口水仗。

百花齐放的原因很大一部分就是前端一开始就没有形成强有力的最佳实践！从工程化角度看，太多的重复轮子很容易导致工程的可维护性变差。

Web 后端稳定性的特点不太能容忍这样的事情发生，推导到云上也一样。

**云原生就是云的（或狭义指 K8S 的）最佳实践，生而为云，所谓云原生！**

为了达到此目的，还有了 [CNCF 云原生计算基金会](https://www.cncf.io/)，有了组织就靠谱多了。这个组织有一个收集（或孵化）了各种最佳实践的 [云原生全景图谱](https://landscape.cncf.io/)。

比如，一个比较有意思的叫 [helm](https://github.com/helm/helm)，作为 K8S 应用包管理器，它把一个 K8S 应用抽象成一个包，一键就可以部署一个应用，跟很多包管理器一样，它也有源 [KubeApps Hub](https://hub.kubeapps.com/)（甚至有阿里云提供的 [国内源](https://developer.aliyun.com/hub)）。

## Serverless

有了云原生，基本各种业务场景都可以找到适合的最佳实践，Serverless 就是其中一种。个人很不理解为什么这个词被翻译成：无服务器架构，Serverless 屏蔽的是运维，所以叫无运维架构更合适。迫于无法接受其中文翻译，文中还是用 Serverless。

你可能好奇，为啥这里要把 Serverless 单独拉出来说下，因为这是 CNCF 的宠儿啊！CNCF 范畴内太多项目了，但是大多还是偏硬，普通业务很难用上并落地，所以抓了个可以落地的当典型，还为其起草了个 [白皮书](https://github.com/cncf/wg-serverless/tree/master/whitepapers/serverless-overview)，建议有兴趣的可以细品。

在说屏蔽运维之前，我们先回顾下运维一般包括哪些：

- 服务器、网络、存储等物理资源（IaaS）申请；
- 测试、发布、扩缩容；
- 监控、日志；
- ...

要达到屏蔽运维大体就是无需关心以上点，目前业界主流形式有 BaaS 和 FaaS：

- BaaS（Backend as a Service）：此服务做法就是把常见的后端服务抽象出来，比如数据存储、文件存储、消息等，客户端使用这些服务时感觉就像在使用普通的 SDK/API。

![front-back.webp](./front-back.webp)

- FaaS（Function as a Service）：BaaS 只在大多数场景好使，某些特殊场景可能就比较麻烦，有些能力可能并没有提供，但是又必须要在后端写。完整关心整个后端代码框架并没必要，所以就可以抽象简单一个个 function 让用户去完成。目前 Google 采用的是 Knative，这里还有个其它方案的对比 文章。

具体采用何种方式取决于业务形态，大体上就是用灵活性换方便度，给各种云服务一个灵活度排序：`IaaS（各种云主机） > CaaS（Docker 等容器服务） > PaaS（BAE、SAE、GAE 等 APP Engine） > FaaS > BaaS > SaaS（各种 Web APP，如 Google Doc）`。

![*ass.webp](./*ass.webp)

歪歪的云计算九层架构，深色的表示留给用户定制的，[灵感来源](https://www.google.com/search?q=iaas+paas+saas&source=lnms&tbm=isch)

**Serverless 为开发者提供了一种屏蔽运维又具备一定灵活度的云服务。**

## 业界现状

本文只关心云原生相关产品，即 Docker/K8S 之上的产品，以下是部分主流产品：

K8S && CaaS

- `Google Kubernetes Engine`
- `Google Cloud Run`
- `Amazon EKS`
- `Azure AKS`
- `阿里云容器服务`

FaaS

- `Google Cloud Functions`
- `AWS Lambda`
- `ZEIT Now`
- `阿里云函数计算`

BaaS

- `LeanCloud`

BaaS + FaaS

- `阿里云小程序云`

## Reference

- [一篇文章快速理解微服务架构](http://dockone.io/article/3687)
- [云原生基础及调研](https://juejin.im/post/5deda052f265da33942a7631)
