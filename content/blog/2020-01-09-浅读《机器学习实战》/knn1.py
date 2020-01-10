import numpy as np
import matplotlib.pyplot as plt

# 4 个测试数据点和已经分好类的数组
group = np.array([[1.0, 1.1], [1.0, 1.3], [3.3, 4.5], [3.3, 4.9]])
labels = ['A', 'A', 'B', 'B']


def classify(input, dataSet, labels, k):
    dataSize = dataSet.shape[0]

    # 计算欧式距离
    diff = np.tile(input, (dataSize, 1)) - dataSet
    sqdiff = diff ** 2
    squareDist = np.sum(sqdiff, axis=1)  # 行向量分别相加，从而得到新的一个行向量
    dist = squareDist ** 0.5

    # 对距离进行排序
    sortedDistIndex = np.argsort(dist)  # argsort()根据元素的值从大到小对元素进行排序，返回下标

    classCount = {}
    for i in range(k):
        voteLabel = labels[sortedDistIndex[i]]
        # 对选取的K个样本所属的类别个数进行统计
        classCount[voteLabel] = classCount.get(voteLabel, 0) + 1
    # 选取出现的类别次数最多的类别
    maxCount = 0
    for key, value in classCount.items():
        if value > maxCount:
            maxCount = value
            classes = key

    return classes


def data_set_plt():
    ax = plt.figure().add_subplot(111)

    for i in range(len(labels)):
        x = group[i][0]
        y = group[i][1]
        ax.scatter(x, y, c='r')
        ax.text(x, y, labels[i])

    plt.xlabel('X')
    plt.ylabel('Y')
    plt.show()


if __name__ == '__main__':
    
    # data_set_plt()

    print(classify([0, 0], group, labels, 3)) # -> A
