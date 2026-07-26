/**
 * Python 学习中心 — 课程数据
 *
 * 三级结构：
 * - Course（课程）：Python 开发 / 智能体开发 / 区块链开发
 * - SubChapter（子章节）：课程内的章
 * - Lesson（课时）：子章节内的具体课时
 *
 * 课时 Markdown 内容存放在 content/lessons/ 目录下。
 */

import type { Course, SubChapter, Lesson } from '@/types';

/**
 * 创建单个课时数据
 */
function createLesson(params: {
  id: string;
  courseId: number;
  chapterId: number;
  lessonNumber: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  contentPath: string;
  initialCode: string;
  expectedOutput: string;
  hint?: string;
  solution?: string;
}): Lesson {
  return {
    ...params,
    slug: params.id,
  };
}

/**
 * 创建子章节
 */
function createSubChapter(params: {
  id: number;
  title: string;
  icon: string;
  lessons: Lesson[];
}): SubChapter {
  return params;
}

// ========== 课程数据 ==========

export const courses: Course[] = [
  // ========== 课程 1：Python 开发 ==========
  {
    id: 1,
    title: 'Python 开发',
    description: '从零开始学习 Python 编程，掌握基础语法、数据结构、函数、面向对象等核心概念。',
    icon: '🐍',
    color: '#3776AB',
    chapters: [
      // ---- 第 1 章：Python 入门（7 课时） ----
      createSubChapter({
        id: 1,
        title: 'Python 入门',
        icon: '📘',
        lessons: [
          createLesson({
            id: '1-1',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 1,
            title: 'Python 简介',
            description: '了解 Python 的历史、特点和适用场景',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-1.md',
            initialCode: '# 欢迎来到 Python 世界！\n# 在这里写下你的第一行代码\nprint("Hello, Python!")',
            expectedOutput: 'Hello, Python!',
            hint: 'Python 由 Guido van Rossum 于 1991 年创建，名字来源于英国喜剧团体 Monty Python。',
          }),
          createLesson({
            id: '1-2',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 2,
            title: '第一个 Python 程序',
            description: '使用 print() 函数输出内容到控制台',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-2.md',
            initialCode: 'print("Hello, World!")\nprint("欢迎学习 Python！")',
            expectedOutput: 'Hello, World!\n欢迎学习 Python！',
            hint: 'print() 是 Python 中最基本的输出函数，用引号包围的内容称为字符串。',
          }),
          createLesson({
            id: '1-3',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 3,
            title: '变量与数据类型',
            description: '学习如何创建变量和 Python 的基本数据类型',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/1-3.md',
            initialCode: '# 创建不同类型的变量\nname = "小明"\nage = 25\nheight = 1.75\nis_student = True\n\nprint(f"姓名：{name}")\nprint(f"年龄：{age}")\nprint(f"身高：{height}")',
            expectedOutput: '姓名：小明\n年龄：25\n身高：1.75',
            hint: 'Python 是动态类型语言，不需要声明变量类型，赋值时自动推断。',
          }),
          createLesson({
            id: '1-4',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 4,
            title: '数字运算',
            description: '掌握 Python 中的算术运算和运算符优先级',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/1-4.md',
            initialCode: '# 基本算术运算\na = 10\nb = 3\n\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b}")\nprint(f"{a} // {b} = {a // b}")  # 整除',
            expectedOutput: '10 + 3 = 13\n10 - 3 = 7\n10 * 3 = 30\n10 / 3 = 3.3333333333333335\n10 // 3 = 3',
            hint: 'Python 支持 +、-、*、/、//（整除）、%（取余）、**（幂运算）。',
          }),
          createLesson({
            id: '1-5',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 5,
            title: '字符串基础',
            description: '学习字符串的创建、拼接和常用方法',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/1-5.md',
            initialCode: '# 字符串操作\ngreeting = "Hello"\nname = "Python"\n\n# 字符串拼接\nmessage = greeting + ", " + name + "!"\nprint(message)\n\n# f-string 格式化（推荐）\nprint(f"{greeting}, {name}!")',
            expectedOutput: 'Hello, Python!\nHello, Python!',
            hint: 'Python 提供了多种字符串格式化方式：+ 拼接、f-string（推荐）、format() 方法。',
          }),
          createLesson({
            id: '1-6',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 6,
            title: '类型转换',
            description: '学习不同类型之间的转换方法',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-6.md',
            initialCode: '# 类型转换\nnum_str = "42"\nnum_int = int(num_str)\nnum_float = float(num_str)\n\nprint(f"字符串: {num_str} (类型: {type(num_str).__name__})")\nprint(f"整数: {num_int} (类型: {type(num_int).__name__})")\nprint(f"浮点数: {num_float} (类型: {type(num_float).__name__})")',
            expectedOutput: '字符串: 42 (类型: str)\n整数: 42 (类型: int)\n浮点数: 42.0 (类型: float)',
            hint: '使用 int()、float()、str() 函数进行类型转换。注意："123" 和 123 是完全不同的类型。',
          }),
          createLesson({
            id: '1-7',
            courseId: 1,
            chapterId: 1,
            lessonNumber: 7,
            title: '代码规范与注释',
            description: '学习 PEP 8 规范、注释写法、缩进规则',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-7.md',
            initialCode: '# 这是单行注释\n\n"""\n这是多行注释（文档字符串）\n可以跨越多行\n"""\n\n# PEP 8 规范要点：\n# 1. 使用 4 个空格缩进（不用 Tab）\n# 2. 每行不超过 79 个字符\n# 3. 运算符两边加空格：a + b，而不是 a+b\n\n# 正确的变量命名（蛇形命名法）\nuser_name = "小明"\nuser_age = 25\n\nprint("代码规范很重要！")',
            expectedOutput: '代码规范很重要！',
            hint: 'Python 使用缩进来表示代码块，推荐使用 4 个空格。PEP 8 是 Python 的官方代码风格指南。',
          }),
        ],
      }),

      // ---- 第 2 章：条件判断（4 课时） ----
      createSubChapter({
        id: 2,
        title: '条件判断',
        icon: '🔀',
        lessons: [
          createLesson({
            id: '1-8',
            courseId: 1,
            chapterId: 2,
            lessonNumber: 1,
            title: 'if 语句',
            description: '学习最基本的条件判断 if 语句',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/agent/2-1.md',
            initialCode: '# if 条件判断\nage = 18\n\nif age >= 18:\n    print("你是成年人")\nelse:\n    print("你是未成年人")',
            expectedOutput: '你是成年人',
            hint: 'if 后面跟条件表达式，条件为 True 时执行缩进块中的代码。注意冒号 : 和缩进。',
          }),
          createLesson({
            id: '1-9',
            courseId: 1,
            chapterId: 2,
            lessonNumber: 2,
            title: 'if-elif-else',
            description: '多条件分支：elif 和 else 的使用',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/agent/2-2.md',
            initialCode: '# 多条件判断\nscore = 85\n\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelif score >= 60:\n    grade = "D"\nelse:\n    grade = "F"\n\nprint(f"分数: {score}, 等级: {grade}")',
            expectedOutput: '分数: 85, 等级: B',
            hint: 'elif 是 "else if" 的缩写，可以有多个 elif。条件按顺序检查，第一个满足的就执行。',
          }),
          createLesson({
            id: '1-10',
            courseId: 1,
            chapterId: 2,
            lessonNumber: 3,
            title: '条件表达式',
            description: '学习逻辑运算符 and/or/not 和比较运算符',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-3.md',
            initialCode: '# 逻辑运算符\nage = 25\nhas_license = True\n\n# and：两个条件都满足\nif age >= 18 and has_license:\n    print("可以开车")\n\n# or：至少一个条件满足\nif age < 18 or not has_license:\n    print("不能开车")',
            expectedOutput: '可以开车',
            hint: 'and 优先级高于 or，not 优先级最高。可以用括号明确优先级。',
          }),
          createLesson({
            id: '1-11',
            courseId: 1,
            chapterId: 2,
            lessonNumber: 4,
            title: 'match 语句',
            description: 'Python 3.10+ 的 match-case 模式匹配',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-4.md',
            initialCode: '# match-case 模式匹配（Python 3.10+）\ndef get_day_name(day):\n    match day:\n        case 1:\n            return "星期一"\n        case 2:\n            return "星期二"\n        case 3:\n            return "星期三"\n        case 4 | 5:\n            return "周四或周五"\n        case _:\n            return "周末"\n\nprint(get_day_name(1))\nprint(get_day_name(4))\nprint(get_day_name(7))',
            expectedOutput: '星期一\n周四或周五\n周末',
            hint: 'match-case 类似其他语言的 switch-case，但更强大，支持模式匹配。case _ 是默认分支。',
          }),
        ],
      }),

      // ---- 第 3 章：循环（5 课时） ----
      createSubChapter({
        id: 3,
        title: '循环',
        icon: '🔄',
        lessons: [
          createLesson({
            id: '1-12',
            courseId: 1,
            chapterId: 3,
            lessonNumber: 1,
            title: 'for 循环',
            description: '学习 for 循环遍历序列',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-12.md',
            initialCode: '# for 循环遍历列表\nfruits = ["苹果", "香蕉", "橙子"]\n\nfor fruit in fruits:\n    print(f"我喜欢吃 {fruit}")',
            expectedOutput: '我喜欢吃 苹果\n我喜欢吃 香蕉\n我喜欢吃 橙子',
            hint: 'for 循环用于遍历任何序列（列表、元组、字符串等）。',
          }),
          createLesson({
            id: '1-13',
            courseId: 1,
            chapterId: 3,
            lessonNumber: 2,
            title: 'while 循环',
            description: '学习 while 循环的基本用法',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-13.md',
            initialCode: '# while 循环\ncount = 1\n\nwhile count <= 5:\n    print(f"第 {count} 次循环")\n    count += 1',
            expectedOutput: '第 1 次循环\n第 2 次循环\n第 3 次循环\n第 4 次循环\n第 5 次循环',
            hint: 'while 循环在条件为 True 时持续执行，注意要确保条件最终会变为 False，否则会无限循环。',
          }),
          createLesson({
            id: '1-14',
            courseId: 1,
            chapterId: 3,
            lessonNumber: 3,
            title: 'break 与 continue',
            description: '掌握循环控制语句 break 和 continue',
            difficulty: 'medium',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-14.md',
            initialCode: '# break：直接退出循环\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)\n\nprint("---")\n\n# continue：跳过当前迭代\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)',
            expectedOutput: '0\n1\n2\n3\n4\n---\n0\n1\n3\n4',
            hint: 'break 完全终止循环，continue 跳过当前迭代进入下一次。',
          }),
          createLesson({
            id: '1-15',
            courseId: 1,
            chapterId: 3,
            lessonNumber: 4,
            title: 'range() 函数',
            description: '使用 range() 生成数字序列',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-15.md',
            initialCode: '# range() 函数的三种用法\n\n# range(n)：0 到 n-1\nprint("0 到 4:")\nfor i in range(5):\n    print(i, end=" ")\n\nprint()\n\n# range(start, stop)：start 到 stop-1\nprint("2 到 5:")\nfor i in range(2, 6):\n    print(i, end=" ")\n\nprint()\n\n# range(start, stop, step)：带步长\nprint("0 到 10，步长 2:")\nfor i in range(0, 11, 2):\n    print(i, end=" ")',
            expectedOutput: '0 到 4:\n0 1 2 3 4 \n2 到 5:\n2 3 4 5 \n0 到 10，步长 2:\n0 2 4 6 8 10 ',
            hint: 'range() 返回一个不可变的数字序列，左闭右开 [start, stop)。',
          }),
          createLesson({
            id: '1-16',
            courseId: 1,
            chapterId: 3,
            lessonNumber: 5,
            title: '嵌套循环',
            description: '学习循环的嵌套使用，打印九九乘法表',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/1-16.md',
            initialCode: '# 嵌套循环 - 九九乘法表\nfor i in range(1, 10):\n    for j in range(1, i + 1):\n        print(f"{j}×{i}={i*j}", end="\\t")\n    print()',
            expectedOutput: '1×1=1\n1×2=2\t2×2=4\n1×3=3\t2×3=6\t3×3=9\n1×4=4\t2×4=8\t3×4=12\t4×4=16\n1×5=5\t2×5=10\t3×5=15\t4×5=20\t5×5=25\n1×6=6\t2×6=12\t3×6=18\t4×6=24\t5×6=30\t6×6=36\n1×7=7\t2×7=14\t3×7=21\t4×7=28\t5×7=35\t6×7=42\t7×7=49\n1×8=8\t2×8=16\t3×8=24\t4×8=32\t5×8=40\t6×8=48\t7×8=56\t8×8=64\n1×9=9\t2×9=18\t3×9=27\t4×9=36\t5×9=45\t6×9=54\t7×9=63\t8×9=72\t9×9=81',
            hint: '嵌套循环的外层控制行，内层控制列。注意外层 i 从 1 到 9，内层 j 从 1 到 i。',
          }),
        ],
      }),

      // ---- 第 4 章：数据结构（6 课时） ----
      createSubChapter({
        id: 4,
        title: '数据结构',
        icon: '📦',
        lessons: [
          createLesson({
            id: '1-17',
            courseId: 1,
            chapterId: 4,
            lessonNumber: 1,
            title: '列表基础',
            description: '学习列表的创建、访问和修改',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/4-1.md',
            initialCode: '# 列表（List）基础\nfruits = ["苹果", "香蕉", "橙子"]\n\n# 访问元素\nprint(fruits[0])  # 第一个元素\nprint(fruits[-1])  # 最后一个元素\n\n# 修改元素\nfruits[1] = "葡萄"\nprint(fruits)\n\n# 添加元素\nfruits.append("西瓜")\nprint(fruits)',
            expectedOutput: '苹果\n橙子\n["苹果", "葡萄", "橙子"]\n["苹果", "葡萄", "橙子", "西瓜"]',
            hint: '列表是有序可变序列，用方括号 [] 定义，索引从 0 开始。',
          }),
          createLesson({
            id: '1-18',
            courseId: 1,
            chapterId: 4,
            lessonNumber: 2,
            title: '列表操作',
            description: '列表的切片、排序、统计等常用操作',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/4-2.md',
            initialCode: '# 列表常用操作\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# 切片 [start:end]（左闭右开）\nprint(numbers[2:5])\n\n# 排序\nnumbers.sort()\nprint(numbers)\n\n# 统计\nprint(f"长度: {len(numbers)}")\nprint(f"最大值: {max(numbers)}")\nprint(f"最小值: {min(numbers)}")',
            expectedOutput: '[4, 1, 5]\n[1, 1, 2, 3, 4, 5, 6, 9]\n长度: 8\n最大值: 9\n最小值: 1',
            hint: '切片 [2:5] 取出索引 2、3、4 的元素。sort() 原地排序，sorted() 返回新列表。',
          }),
          createLesson({
            id: '1-19',
            courseId: 1,
            chapterId: 4,
            lessonNumber: 3,
            title: '元组',
            description: '学习不可变序列元组',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/4-3.md',
            initialCode: '# 元组（Tuple）— 不可变序列\npoint = (10, 20)\n\nprint(f"x: {point[0]}, y: {point[1]}")\n\n# 元组解包\nx, y = point\nprint(f"解包: x={x}, y={y}")\n\n# 元组常用于函数返回多个值\ndef get_name_age():\n    return "小明", 25\n\nname, age = get_name_age()\nprint(f"姓名: {name}, 年龄: {age}")',
            expectedOutput: 'x: 10, y: 20\n解包: x=10, y=20\n姓名: 小明, 年龄: 25',
            hint: '元组用圆括号 () 定义，不可修改（immutable），适合存储不应改变的数据。',
          }),
          createLesson({
            id: '1-20',
            courseId: 1,
            chapterId: 4,
            lessonNumber: 4,
            title: '字典基础',
            description: '学习字典的创建和基本操作',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/4-4.md',
            initialCode: '# 字典（Dictionary）— 键值对映射\nstudent = {\n    "name": "小明",\n    "age": 20,\n    "grade": "A",\n}\n\n# 访问值\nprint(student["name"])\nprint(student.get("age"))\n\n# 添加/修改\nstudent["city"] = "北京"\nstudent["age"] = 21\n\n# 遍历\nfor key, value in student.items():\n    print(f"{key}: {value}")',
            expectedOutput: '小明\n20\nname: 小明\nage: 21\ngrade: A\ncity: 北京',
            hint: '字典用花括号 {} 定义，通过键（key）访问值（value）。键必须是不可变类型。',
          }),
          createLesson({
            id: '1-21',
            courseId: 1,
            chapterId: 4,
            lessonNumber: 5,
            title: '集合',
            description: '学习集合去重和集合运算',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/4-5.md',
            initialCode: '# 集合（Set）— 无序不重复\nfruits = {"苹果", "香蕉", "橙子", "苹果"}\nprint(f"去重后: {fruits}")\n\n# 集合运算\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\nprint(f"并集: {a | b}")\nprint(f"交集: {a & b}")\nprint(f"差集: {a - b}")',
            expectedOutput: '去重后: {"苹果", "香蕉", "橙子"}\n并集: {1, 2, 3, 4, 5, 6}\n交集: {3, 4}\n差集: {1, 2}',
            hint: '集合用花括号 {} 定义，自动去重，是无序的。支持 |（并集）、&（交集）、-（差集）运算。',
          }),
          createLesson({
            id: '1-22',
            courseId: 1,
            chapterId: 4,
            lessonNumber: 6,
            title: '数据结构综合练习',
            description: '综合运用列表、字典等数据结构解决问题',
            difficulty: 'medium',
            duration: 20,
            contentPath: '/src/lib/content/lessons/python/4-6.md',
            initialCode: '# 综合练习：统计学生成绩\nstudents = [\n    {"name": "小明", "scores": [85, 90, 78]},\n    {"name": "小红", "scores": [92, 88, 95]},\n    {"name": "小刚", "scores": [70, 65, 80]},\n]\n\nfor student in students:\n    name = student["name"]\n    scores = student["scores"]\n    avg = sum(scores) / len(scores)\n    print(f"{name}: 平均分 {avg:.1f}")',
            expectedOutput: '小明: 平均分 84.3\n小红: 平均分 91.7\n小刚: 平均分 71.7',
            hint: '使用 sum() 计算列表总和，len() 获取列表长度，f"{value:.1f}" 保留一位小数。',
          }),
        ],
      }),

      // ---- 第 5 章：函数（5 课时） ----
      createSubChapter({
        id: 5,
        title: '函数',
        icon: '🧩',
        lessons: [
          createLesson({
            id: '1-23',
            courseId: 1,
            chapterId: 5,
            lessonNumber: 1,
            title: '函数定义与调用',
            description: '学习如何定义和调用函数',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/5-1.md',
            initialCode: '# 函数定义与调用\n\ndef greet(name):\n    """打招呼函数"""\n    return f"你好，{name}！"\n\nmessage = greet("小明")\nprint(message)',
            expectedOutput: '你好，小明！',
            hint: '使用 def 关键字定义函数，函数名后跟圆括号和冒号。三引号字符串是文档字符串（docstring）。',
          }),
          createLesson({
            id: '1-24',
            courseId: 1,
            chapterId: 5,
            lessonNumber: 2,
            title: '参数与返回值',
            description: '学习位置参数、默认参数、关键字参数',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/5-2.md',
            initialCode: '# 参数类型\n\ndef introduce(name, age, city="北京"):\n    """介绍自己"""\n    return f"我是{name}，{age}岁，来自{city}"\n\n# 位置参数\nprint(introduce("小明", 20))\n\n# 关键字参数\nprint(introduce(name="小红", age=22, city="上海"))',
            expectedOutput: '我是小明，20岁，来自北京\n我是小红，22岁，来自上海',
            hint: '默认参数在函数定义时指定，调用时可省略。关键字参数可指定参数名，顺序不限。',
          }),
          createLesson({
            id: '1-25',
            courseId: 1,
            chapterId: 5,
            lessonNumber: 3,
            title: '可变参数',
            description: '学习 *args 和 **kwargs 的使用',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/5-3.md',
            initialCode: '# 可变参数\n\ndef sum_all(*args):\n    """计算任意个数的和"""\n    total = 0\n    for num in args:\n        total += num\n    return total\n\nprint(sum_all(1, 2, 3))\nprint(sum_all(1, 2, 3, 4, 5))\n\ndef print_info(**kwargs):\n    """打印任意键值对"""\n    for key, value in kwargs.items():\n        print(f"{key}: {value}")\n\nprint_info(name="小明", age=20, city="北京")',
            expectedOutput: '6\n15\nname: 小明\nage: 20\ncity: 北京',
            hint: '*args 接收任意数量的位置参数（元组），**kwargs 接收任意数量的关键字参数（字典）。',
          }),
          createLesson({
            id: '1-26',
            courseId: 1,
            chapterId: 5,
            lessonNumber: 4,
            title: '作用域',
            description: '理解局部变量、全局变量和作用域规则',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/5-4.md',
            initialCode: '# 作用域\nx = 10  # 全局变量\n\ndef my_function():\n    y = 20  # 局部变量\n    print(f"函数内 x = {x}")  # 可以访问全局变量\n    print(f"函数内 y = {y}")\n\nmy_function()\nprint(f"函数外 x = {x}")\n# print(y)  # 这行会报错！y 是局部变量',
            expectedOutput: '函数内 x = 10\n函数内 y = 20\n函数外 x = 10',
            hint: 'LEGB 规则：Local（局部）→ Enclosing（嵌套）→ Global（全局）→ Built-in（内置）。',
          }),
          createLesson({
            id: '1-27',
            courseId: 1,
            chapterId: 5,
            lessonNumber: 5,
            title: '递归函数',
            description: '学习递归思想和经典递归问题',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/5-5.md',
            initialCode: '# 递归函数：计算阶乘\n\ndef factorial(n):\n    """计算 n 的阶乘"""\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\n# 递归计算斐波那契数列\n\ndef fibonacci(n):\n    """计算斐波那契数列第 n 项"""\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(f"5! = {factorial(5)}")\nprint(f"fib(10) = {fibonacci(10)}")',
            expectedOutput: '5! = 120\nfib(10) = 55',
            hint: '递归必须要有基线条件（终止条件），否则会无限递归。阶乘的基线条件是 n <= 1。',
          }),
        ],
      }),

      // ---- 第 6 章：文件操作（4 课时） ----
      createSubChapter({
        id: 6,
        title: '文件操作',
        icon: '📁',
        lessons: [
          createLesson({
            id: '1-28',
            courseId: 1,
            chapterId: 6,
            lessonNumber: 1,
            title: '文件读写基础',
            description: '学习 open() 函数和文件读写模式',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/6-1.md',
            initialCode: '# 文件读写\n# 注意：在浏览器环境中文件操作受限\n# 这里演示基本语法\n\ncontent = "Hello, File!"\n\n# 写入文件（语法演示）\n# with open("test.txt", "w", encoding="utf-8") as f:\n#     f.write(content)\n\n# 读取文件（语法演示）\n# with open("test.txt", "r", encoding="utf-8") as f:\n#     data = f.read()\n#     print(data)\n\nprint("文件操作语法已学习！")\nprint("实际文件操作需要后端环境支持。")',
            expectedOutput: '文件操作语法已学习！\n实际文件操作需要后端环境支持。',
            hint: 'with 语句确保文件正确关闭。模式：r（读取）、w（写入）、a（追加）。',
          }),
          createLesson({
            id: '1-29',
            courseId: 1,
            chapterId: 6,
            lessonNumber: 2,
            title: '逐行读取',
            description: '学习逐行读取文件内容',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/6-2.md',
            initialCode: '# 逐行读取文件（语法演示）\n\nlines = ["第一行", "第二行", "第三行"]\n\nfor line in lines:\n    print(f"读取: {line}")',
            expectedOutput: '读取: 第一行\n读取: 第二行\n读取: 第三行',
            hint: 'for line in file 是逐行读取的标准方式，内存效率高。',
          }),
          createLesson({
            id: '1-30',
            courseId: 1,
            chapterId: 6,
            lessonNumber: 3,
            title: 'JSON 文件处理',
            description: '学习 JSON 数据的读写',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/6-3.md',
            initialCode: '# JSON 处理\nimport json\n\n# Python 对象 → JSON 字符串\nperson = {"name": "小明", "age": 20, "city": "北京"}\njson_str = json.dumps(person, ensure_ascii=False)\nprint(f"JSON 字符串: {json_str}")\n\n# JSON 字符串 → Python 对象\nrestored = json.loads(json_str)\nprint(f"恢复: {restored["name"]}, {restored["age"]}岁")',
            expectedOutput: 'JSON 字符串: {"name": "小明", "age": 20, "city": "北京"}\n恢复: 小明, 20岁',
            hint: 'json.dumps() 序列化，json.loads() 反序列化。ensure_ascii=False 保留中文。',
          }),
          createLesson({
            id: '1-31',
            courseId: 1,
            chapterId: 6,
            lessonNumber: 4,
            title: 'with 语句与上下文管理器',
            description: '深入理解 with 语句的资源管理',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/6-4.md',
            initialCode: '# with 语句确保资源正确释放\n\nclass Timer:\n    def __enter__(self):\n        import time\n        self.start = time.time()\n        return self\n\n    def __exit__(self, *args):\n        import time\n        self.end = time.time()\n        print(f"耗时: {self.end - self.start:.4f} 秒")\n\n# 使用上下文管理器\nwith Timer():\n    total = sum(range(1000000))\n    print(f"计算完成: {total}")',
            expectedOutput: '计算完成: 499999500000\n耗时: 0.0xxx 秒',
            hint: 'with 语句调用 __enter__ 和 __exit__ 方法，适合文件、锁等需要清理的资源。',
          }),
        ],
      }),

      // ---- 第 7 章：异常处理（3 课时） ----
      createSubChapter({
        id: 7,
        title: '异常处理',
        icon: '⚠️',
        lessons: [
          createLesson({
            id: '1-32',
            courseId: 1,
            chapterId: 7,
            lessonNumber: 1,
            title: '异常基础',
            description: '了解常见异常类型和 try-except 语法',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/7-1.md',
            initialCode: '# 异常处理基础\ntry:\n    num = 10  # 模拟用户输入\n    result = 100 / num\n    print(f"100 / {num} = {result}")\nexcept ValueError:\n    print("错误：请输入有效的数字！")\nexcept ZeroDivisionError:\n    print("错误：不能除以零！")\nexcept Exception as e:\n    print(f"未知错误: {e}")',
            expectedOutput: '100 / 10 = 10.0',
            hint: 'try 块中的代码如果出错，会跳到对应的 except 块。可以捕获多种异常。',
          }),
          createLesson({
            id: '1-33',
            courseId: 1,
            chapterId: 7,
            lessonNumber: 2,
            title: 'finally 与 else',
            description: '学习 finally 和 else 子句的用法',
            difficulty: 'medium',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/7-2.md',
            initialCode: '# finally：无论是否异常都会执行\n\ndef divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        print("错误：除数不能为零")\n        result = None\n    finally:\n        print("清理资源或记录日志...")\n    return result\n\nprint(divide(10, 2))\nprint("---")\nprint(divide(10, 0))',
            expectedOutput: '清理资源或记录日志...\n5.0\n---\n错误：除数不能为零\n清理资源或记录日志...\nNone',
            hint: 'finally 总是执行，适合清理资源。else 仅在 try 没有异常时执行。',
          }),
          createLesson({
            id: '1-34',
            courseId: 1,
            chapterId: 7,
            lessonNumber: 3,
            title: '自定义异常',
            description: '学习如何定义和抛出自定义异常',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/7-3.md',
            initialCode: '# 自定义异常\nclass AgeError(Exception):\n    """年龄异常"""\n    def __init__(self, age):\n        self.age = age\n        super().__init__(f"年龄 {age} 不合法！必须在 0-150 之间。")\n\ndef set_age(age):\n    if not 0 <= age <= 150:\n        raise AgeError(age)\n    return f"年龄设置为 {age}"\n\ntry:\n    print(set_age(25))\n    print(set_age(-5))\nexcept AgeError as e:\n    print(f"捕获异常: {e}")',
            expectedOutput: '年龄设置为 25\n捕获异常: 年龄 -5 不合法！必须在 0-150 之间。',
            hint: '自定义异常继承 Exception 类，通过 raise 关键字抛出。',
          }),
        ],
      }),

      // ---- 第 8 章：类与对象（5 课时） ----
      createSubChapter({
        id: 8,
        title: '类与对象',
        icon: '🧱',
        lessons: [
          createLesson({
            id: '8-1',
            courseId: 1,
            chapterId: 8,
            lessonNumber: 1,
            title: '类与对象',
            description: '理解面向对象编程的基本概念，学习类的定义和对象的创建',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/8-1.md',
            initialCode: '# 类与对象\nclass Dog:\n    """狗类"""\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n\n    def bark(self):\n        return f"{self.name} 汪汪叫！"\n\n    def introduce(self):\n        return f"我是 {self.name}，品种是 {self.breed}"\n\n# 创建对象实例\ndog1 = Dog("旺财", "金毛")\ndog2 = Dog("来福", "柴犬")\n\nprint(dog1.introduce())\nprint(dog2.bark())',
            expectedOutput: '我是 旺财，品种是 金毛\n来福 汪汪叫！',
            hint: '类用 class 关键字定义，__init__ 是构造方法，self 指代实例本身。',
          }),
          createLesson({
            id: '8-2',
            courseId: 1,
            chapterId: 8,
            lessonNumber: 2,
            title: '实例变量与类变量',
            description: '区分实例变量和类变量，理解它们的内存和行为差异',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/8-2.md',
            initialCode: '# 实例变量 vs 类变量\nclass Student:\n    school = "Python 学校"  # 类变量（所有实例共享）\n\n    def __init__(self, name):\n        self.name = name  # 实例变量（每个实例独立）\n\ns1 = Student("小明")\ns2 = Student("小红")\n\nprint(f"{s1.name} 在 {s1.school}")\nprint(f"{s2.name} 在 {s2.school}")\nprint(f"学校是同一个: {s1.school is s2.school}")',
            expectedOutput: '小明 在 Python 学校\n小红 在 Python 学校\n学校是同一个: True',
            hint: '实例变量通过 self.xxx 定义，每个对象独立。类变量在类内部定义，所有实例共享。',
          }),
          createLesson({
            id: '8-3',
            courseId: 1,
            chapterId: 8,
            lessonNumber: 3,
            title: '继承',
            description: '学习类的继承机制，实现代码复用和多态',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/8-3.md',
            initialCode: '# 继承\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "动物叫声"\n\n    def introduce(self):\n        return f"我是 {self.name}"\n\nclass Cat(Animal):\n    def speak(self):\n        return "喵喵喵~"\n\nclass Dog(Animal):\n    def speak(self):\n        return "汪汪汪！"\n\ncat = Cat("咪咪")\ndog = Dog("旺财")\n\nprint(cat.introduce())\nprint(f"{cat.name}: {cat.speak()}")\nprint(f"{dog.name}: {dog.speak()}")',
            expectedOutput: '我是 咪咪\n咪咪: 喵喵喵~\n旺财: 汪汪汪！',
            hint: '子类通过 super().__init__() 调用父类构造方法。子类可以重写父类的方法。',
          }),
          createLesson({
            id: '8-4',
            courseId: 1,
            chapterId: 8,
            lessonNumber: 4,
            title: '多态',
            description: '理解多态的概念，学习如何通过统一接口处理不同类型的对象',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/8-4.md',
            initialCode: '# 多态\nclass Cat:\n    def speak(self):\n        return "喵喵喵~"\n\nclass Dog:\n    def speak(self):\n        return "汪汪汪！"\n\nclass Duck:\n    def speak(self):\n        return "嘎嘎嘎！"\n\n# 多态：统一接口处理不同类型\nanimals = [Cat(), Dog(), Duck()]\n\nfor animal in animals:\n    print(animal.speak())\n\n# 函数多态\ndef make_speak(animal):\n    print(animal.speak())\n\nprint("---")\nmake_speak(Cat())\nmake_speak(Dog())',
            expectedOutput: '喵喵喵~\n汪汪汪！\n嘎嘎嘎！\n---\n喵喵喵~\n汪汪汪！',
            hint: '多态让不同类型的对象可以对相同的消息（方法调用）做出不同的响应。Python 是 Duck Typing 语言。',
          }),
          createLesson({
            id: '8-5',
            courseId: 1,
            chapterId: 8,
            lessonNumber: 5,
            title: '封装与私有属性',
            description: '学习封装的概念，使用私有属性和属性装饰器保护数据',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/8-5.md',
            initialCode: '# 封装与私有属性\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.__balance = balance  # 私有属性（双下划线）\n\n    def deposit(self, amount):\n        if amount > 0:\n            self.__balance += amount\n            print(f"存入 {amount} 元")\n\n    def withdraw(self, amount):\n        if 0 < amount <= self.__balance:\n            self.__balance -= amount\n            print(f"取出 {amount} 元")\n        else:\n            print("余额不足或金额无效")\n\n    def get_balance(self):\n        return self.__balance\n\naccount = BankAccount("小明", 1000)\naccount.deposit(500)\naccount.withdraw(200)\nprint(f"余额: {account.get_balance()} 元")',
            expectedOutput: '存入 500 元\n取出 200 元\n余额: 1300 元',
            hint: '双下划线 __xxx 是 Python 的私有属性约定（名称修饰），外部不应直接访问。通过方法控制数据访问。',
          }),
        ],
      }),

      // ---- 第 9 章：常用模块（4 课时） ----
      createSubChapter({
        id: 9,
        title: '常用模块',
        icon: '📚',
        lessons: [
          createLesson({
            id: '9-1',
            courseId: 1,
            chapterId: 9,
            lessonNumber: 1,
            title: 'random 模块',
            description: '学习 random 模块，掌握随机数生成、随机选择和随机打乱等常用功能',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/9-1.md',
            initialCode: '# random 模块\nimport random\n\n# 生成随机整数\nprint(f"1-100 随机数: {random.randint(1, 100)}")\n\n# 从列表中随机选择\nfruits = ["苹果", "香蕉", "橙子", "葡萄"]\nprint(f"随机水果: {random.choice(fruits)}")\n\n# 随机打乱列表\ncards = [1, 2, 3, 4, 5]\nrandom.shuffle(cards)\nprint(f"打乱后: {cards}")',
            expectedOutput: '1-100 随机数: 42\n随机水果: 香蕉\n打乱后: [3, 1, 5, 2, 4]',
            hint: 'randint(a, b) 生成 a 到 b 的随机整数（含边界）。choice() 随机选择，shuffle() 原地打乱。',
          }),
          createLesson({
            id: '9-2',
            courseId: 1,
            chapterId: 9,
            lessonNumber: 2,
            title: 'datetime 模块',
            description: '学习 datetime 模块处理日期和时间',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/9-2.md',
            initialCode: '# datetime 模块\nfrom datetime import datetime, timedelta\n\n# 获取当前时间\nnow = datetime.now()\nprint(f"当前时间: {now}")\nprint(f"年: {now.year}, 月: {now.month}, 日: {now.day}")\n\n# 日期格式化\nprint(f"格式化: {now.strftime(\'%Y-%m-%d %H:%M:%S\')}")\n\n# 日期计算\ntomorrow = now + timedelta(days=1)\nprint(f"明天: {tomorrow.strftime(\'%Y-%m-%d\')}")\n\n# 计算日期差\nd1 = datetime(2024, 1, 1)\nd2 = datetime(2024, 12, 31)\ndelta = d2 - d1\nprint(f"2024年还有 {delta.days} 天")',
            expectedOutput: '当前时间: 2024-07-25 14:30:00\n年: 2024, 月: 7, 日: 25\n格式化: 2024-07-25 14:30:00\n明天: 2024-07-26\n2024年还有 365 天',
            hint: 'datetime.now() 获取当前时间，strftime() 格式化，timedelta 表示时间差。',
          }),
          createLesson({
            id: '9-3',
            courseId: 1,
            chapterId: 9,
            lessonNumber: 3,
            title: 'math 模块',
            description: '学习 math 模块的数学函数和常量',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/9-3.md',
            initialCode: '# math 模块\nimport math\n\n# 常用常量\nprint(f"π = {math.pi}")\nprint(f"e = {math.e}")\nprint(f"∞ = {math.inf}")\n\n# 数学函数\nprint(f"ceil(3.2) = {math.ceil(3.2)}")\nprint(f"floor(3.8) = {math.floor(3.8)}")\nprint(f"round(3.14159, 2) = {round(math.pi, 2)}")\nprint(f"sqrt(16) = {math.sqrt(16)}")\nprint(f"pow(2, 10) = {math.pow(2, 10)}")\nprint(f"abs(-5) = {math.fabs(-5)}")',
            expectedOutput: 'π = 3.141592653589793\ne = 2.718281828459045\n∞ = inf\nceil(3.2) = 4\nfloor(3.8) = 3\nround(3.14159, 2) = 3.14\nsqrt(16) = 4.0\npow(2, 10) = 1024.0\nabs(-5) = 5.0',
            hint: 'math.ceil() 向上取整，math.floor() 向下取整，math.sqrt() 开方。round() 是内置函数。',
          }),
          createLesson({
            id: '9-4',
            courseId: 1,
            chapterId: 9,
            lessonNumber: 4,
            title: 'collections 模块',
            description: '学习 collections 模块的高性能数据结构',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/python/9-4.md',
            initialCode: '# collections 模块\nfrom collections import Counter, defaultdict, deque\n\n# Counter — 计数器\nwords = ["apple", "banana", "apple", "cherry", "banana", "apple"]\ncount = Counter(words)\nprint(f"词频统计: {count}")\nprint(f"apple 出现 {count[\'apple\']} 次")\n\n# defaultdict — 带默认值的字典\ngrades = defaultdict(list)\ngrades[\'小明\'].append(90)\ngrades[\'小明\'].append(85)\ngrades[\'小红\'].append(95)\nprint(f"成绩: {dict(grades)}")\n\n# deque — 双端队列\nd = deque([1, 2, 3])\nd.appendleft(0)\nd.append(4)\nprint(f"双端队列: {list(d)}")',
            expectedOutput: "词频统计: Counter({'apple': 3, 'banana': 2, 'cherry': 1})\napple 出现 3 次\n成绩: {'小明': [90, 85], '小红': [95]}\n双端队列: [0, 1, 2, 3, 4]",
            hint: 'Counter 自动统计元素出现次数。defaultdict 访问不存在的 key 时返回默认值。deque 支持两端高效操作。',
          }),
        ],
      }),

      // ---- 第 10 章：综合项目（4 课时） ----
      createSubChapter({
        id: 10,
        title: '综合项目',
        icon: '🎯',
        lessons: [
          createLesson({
            id: '10-1',
            courseId: 1,
            chapterId: 10,
            lessonNumber: 1,
            title: '猜数字游戏',
            description: '综合运用循环、条件判断和随机数，构建经典的猜数字游戏',
            difficulty: 'medium',
            duration: 20,
            contentPath: '/src/lib/content/lessons/python/10-1.md',
            initialCode: '# 猜数字游戏\nimport random\n\nsecret = random.randint(1, 100)\nattempts = 0\n\nprint("猜数字游戏！我已经想好了一个 1-100 的数字。")\n\n# 游戏主循环（演示 5 轮）\nfor i in range(5):\n    guess = random.randint(1, 100)  # 模拟猜测\n    attempts += 1\n\n    if guess == secret:\n        print(f"第 {attempts} 次：你猜对了！答案是 {secret}")\n        break\n    elif guess < secret:\n        print(f"第 {attempts} 次：{guess} 太小了！")\n    else:\n        print(f"第 {attempts} 次：{guess} 太大了！")',
            expectedOutput: '猜数字游戏！我已经想好了一个 1-100 的数字。\n第 1 次：42 太小了！\n第 2 次：78 太大了！\n第 3 次：你猜对了！答案是 78',
            hint: '使用 random.randint() 生成随机数，while 循环让玩家持续猜测，try-except 处理无效输入。',
          }),
          createLesson({
            id: '10-2',
            courseId: 1,
            chapterId: 10,
            lessonNumber: 2,
            title: '简易计算器',
            description: '构建支持加减乘除的简易计算器程序',
            difficulty: 'medium',
            duration: 20,
            contentPath: '/src/lib/content/lessons/python/10-2.md',
            initialCode: '# 简易计算器\ndef calculator(a, b, op):\n    """执行基本运算"""\n    if op == "+":\n        return a + b\n    elif op == "-":\n        return a - b\n    elif op == "*":\n        return a * b\n    elif op == "/":\n        if b == 0:\n            return "错误：除数不能为零"\n        return a / b\n    else:\n        return "错误：未知运算符"\n\n# 测试计算器\nprint(f"10 + 5 = {calculator(10, 5, \'+\')}")\nprint(f"10 - 5 = {calculator(10, 5, \'-\')}")\nprint(f"10 * 5 = {calculator(10, 5, \'*\')}")\nprint(f"10 / 5 = {calculator(10, 5, \'/\')}")\nprint(f"10 / 0 = {calculator(10, 0, \'/\')}")',
            expectedOutput: '10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2.0\n10 / 0 = 错误：除数不能为零',
            hint: '使用函数封装计算逻辑，if-elif 处理不同运算符。注意除法时除数为零的特殊处理。',
          }),
          createLesson({
            id: '10-3',
            courseId: 1,
            chapterId: 10,
            lessonNumber: 3,
            title: '待办事项列表',
            description: '使用列表和字典构建命令行待办事项管理程序',
            difficulty: 'medium',
            duration: 20,
            contentPath: '/src/lib/content/lessons/python/10-3.md',
            initialCode: '# 待办事项列表\ntodos = []\n\ndef add_task(title):\n    todos.append({"title": title, "done": False})\n    print(f"已添加: {title}")\n\ndef complete_task(index):\n    if 0 <= index < len(todos):\n        todos[index]["done"] = True\n        print(f"已完成: {todos[index][\'title\']}")\n\n# 使用示例\nadd_task("学习 Python")\nadd_task("完成作业")\nadd_task("复习笔记")\n\ncomplete_task(0)\ncomplete_task(2)\n\n# 显示所有任务\nprint("\\n当前任务列表:")\nfor i, task in enumerate(todos):\n    status = "✓" if task["done"] else "○"\n    print(f"  {status} {task[\'title\']}")',
            expectedOutput: '已添加: 学习 Python\n已添加: 完成作业\n已添加: 复习笔记\n已完成: 学习 Python\n已完成: 复习笔记\n\n当前任务列表:\n  ✓ 学习 Python\n  ○ 完成作业\n  ✓ 复习笔记',
            hint: '用字典存储每个待办项（标题+状态），列表管理所有待办项。enumerate() 同时获取索引和值。',
          }),
          createLesson({
            id: '10-4',
            courseId: 1,
            chapterId: 10,
            lessonNumber: 4,
            title: '学生成绩管理系统',
            description: '综合运用函数、字典、列表等知识构建完整的学生管理系统',
            difficulty: 'hard',
            duration: 25,
            contentPath: '/src/lib/content/lessons/python/10-4.md',
            initialCode: '# 学生成绩管理系统\n\nstudents = []\n\ndef add_student(name, scores):\n    students.append({\n        "name": name,\n        "scores": scores,\n        "avg": sum(scores) / len(scores),\n    })\n\n# 添加学生\nadd_student("小明", [85, 90, 78, 92])\nadd_student("小红", [92, 88, 95, 90])\nadd_student("小刚", [70, 65, 80, 75])\n\n# 统计\nprint("=== 学生成绩统计 ===\\n")\nfor s in students:\n    grade = "A" if s["avg"] >= 90 else "B" if s["avg"] >= 80 else "C"\n    print(f"{s[\'name\']}: 平均 {s[\'avg\']:.1f} 等级 {grade}")\n\n# 全班统计\navgs = [s["avg"] for s in students]\nprint(f"\\n全班平均: {sum(avgs)/len(avgs):.1f}")\nprint(f"最高分: {max(avgs):.1f}")\nprint(f"最低分: {min(avgs):.1f}")',
            expectedOutput: '=== 学生成绩统计 ===\n\n小明: 平均 86.2 等级 B\n小红: 平均 91.2 等级 A\n小刚: 平均 72.5 等级 C\n\n全班平均: 83.3\n最高分: 91.2\n最低分: 72.5',
            hint: '用字典存储学生信息，列表存储所有学生。列表推导式 [s["avg"] for s in students] 提取平均值。',
          }),
        ],
      }),
    ],
  },

  // ========== 课程 2：智能体开发 ==========
  {
    id: 2,
    title: '智能体开发',
    description: '从零构建 AI Agent，掌握 LLM 集成、工具调用、记忆系统、多 Agent 协作等核心技术。',
    icon: '🤖',
    color: '#A78BFA',
    chapters: [
      // ---- 第 1 章：Agent 基础（2 课时） ----
      createSubChapter({
        id: 1,
        title: 'Agent 基础',
        icon: '🤖',
        lessons: [
          createLesson({
            id: '2-1',
            courseId: 2,
            chapterId: 1,
            lessonNumber: 1,
            title: 'AI Agent 概述',
            description: '了解 AI Agent 的定义、分类和发展历程',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/agent/2-1.md',
            initialCode: '# AI Agent 概述\n\n# Agent = 大语言模型 + 规划 + 记忆 + 工具使用\n\nprint("AI Agent 核心组件:")\nprint("1. 大语言模型 (LLM) — 推理与决策")\nprint("2. 规划 (Planning) — 分解复杂任务")\nprint("3. 记忆 (Memory) — 短期/长期记忆")\nprint("4. 工具使用 (Tool Use) — 调用外部 API")',
            expectedOutput: 'AI Agent 核心组件:\n1. 大语言模型 (LLM) — 推理与决策\n2. 规划 (Planning) — 分解复杂任务\n3. 记忆 (Memory) — 短期/长期记忆\n4. 工具使用 (Tool Use) — 调用外部 API',
            hint: 'AI Agent 与普通聊天机器人的核心区别：Agent 可以自主规划、调用工具、使用记忆。',
          }),
          createLesson({
            id: '2-2',
            courseId: 2,
            chapterId: 1,
            lessonNumber: 2,
            title: 'LLM 基础与 Prompt Engineering',
            description: '理解大语言模型原理，掌握 Prompt 编写技巧',
            difficulty: 'easy',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-2.md',
            initialCode: '# Prompt Engineering 示例\n\n# System Prompt 模板\nsystem_prompt = """\n你是一个专业的 Python 编程助手。\n请用简洁清晰的方式回答问题。\n如果涉及代码，请提供可运行的示例。\n"""\n\n# User Prompt 模板\nuser_prompt = """\n请解释 Python 中列表和元组的区别。\n"""\n\nprint("System Prompt:")\nprint(system_prompt)\nprint("\\nUser Prompt:")\nprint(user_prompt)',
            expectedOutput: 'System Prompt:\n你是一个专业的 Python 编程助手。\n请用简洁清晰的方式回答问题。\n如果涉及代码，请提供可运行的示例。\n\nUser Prompt:\n请解释 Python 中列表和元组的区别。',
            hint: '好的 Prompt 应包含：角色定义、任务描述、输出格式要求、示例（Few-shot）。',
          }),
        ],
      }),

      // ---- 第 2 章：Agent 核心能力（4 课时） ----
      createSubChapter({
        id: 2,
        title: 'Agent 核心能力',
        icon: '⚡',
        lessons: [
          createLesson({
            id: '2-3',
            courseId: 2,
            chapterId: 2,
            lessonNumber: 1,
            title: 'ReAct 推理框架',
            description: '掌握推理（Reasoning）与行动（Acting）交替的 Agent 模式',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-3.md',
            initialCode: `# ReAct 框架示例

# ReAct = Reasoning + Acting
# Agent 交替进行思考(Thought)和行动(Action)

thoughts = [
    "Thought: 用户问北京的天气，我需要查询天气 API",
    "Action: 调用 weather_api(city='北京')",
    'Observation: {"temp": 25, "condition": "晴天"}',
    "Thought: 已获取天气数据，整理成自然语言回复",
    "Action: 生成最终回答",
    "Answer: 北京今天晴天，气温 25°C",
]

for step in thoughts:
    print(step)`,
            expectedOutput: 'Thought: 用户问北京的天气，我需要查询天气 API\nAction: 调用 weather_api(city=\'北京\')\nObservation: {"temp": 25, "condition": "晴天"}\nThought: 已获取天气数据，整理成自然语言回复\nAction: 生成最终回答\nAnswer: 北京今天晴天，气温 25°C',
            hint: 'ReAct 的核心是让 LLM 交替输出思考过程和具体行动，而非一次性给出答案。',
          }),
          createLesson({
            id: '2-4',
            courseId: 2,
            chapterId: 2,
            lessonNumber: 2,
            title: '工具调用与 Function Calling',
            description: '让 Agent 具备调用外部工具和 API 的能力',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-4.md',
            initialCode: '# Function Calling 示例\n\nimport json\n\n# 定义可用工具\ntools = [\n    {\n        "name": "get_weather",\n        "description": "获取指定城市的天气信息",\n        "parameters": {\n            "type": "object",\n            "properties": {\n                "city": {"type": "string", "description": "城市名称"}\n            },\n            "required": ["city"]\n        }\n    },\n    {\n        "name": "send_email",\n        "description": "发送电子邮件",\n        "parameters": {\n            "type": "object",\n            "properties": {\n                "to": {"type": "string"},\n                "subject": {"type": "string"},\n                "body": {"type": "string"}\n            },\n            "required": ["to", "subject", "body"]\n        }\n    }\n]\n\nprint("可用工具列表:")\nfor tool in tools:\n    print(f"  - {tool[\'name\']}: {tool[\'description\']}")',
            expectedOutput: '可用工具列表:\n  - get_weather: 获取指定城市的天气信息\n  - send_email: 发送电子邮件',
            hint: 'Function Calling 让 LLM 输出结构化的工具调用请求，而非自由文本。',
          }),
          createLesson({
            id: '2-5',
            courseId: 2,
            chapterId: 2,
            lessonNumber: 3,
            title: '记忆系统',
            description: '理解短期记忆和长期记忆的设计与实现',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-5.md',
            initialCode: '# Agent 记忆系统设计\n\n# 短期记忆：当前对话的上下文\nshort_term_memory = {\n    "messages": [\n        {"role": "user", "content": "我叫小明"},\n        {"role": "assistant", "content": "你好，小明！有什么我可以帮助你的吗？"},\n    ],\n    "max_tokens": 4000,\n}\n\n# 长期记忆：持久化的用户信息和历史\ndef save_long_term_memory(key, value):\n    memory_db = {\n        "user_name": "小明",\n        "preferences": {"language": "中文", "theme": "dark"},\n        "history": ["询问了 Python 学习路径", "询问了职业规划建议"],\n    }\n    memory_db[key] = value\n    return memory_db\n\nprint("短期记忆消息数:", len(short_term_memory["messages"]))\nmemory = save_long_term_memory("last_topic", "AI Agent 开发")\nprint("长期记忆主题:", memory["last_topic"])',
            expectedOutput: '短期记忆消息数: 2\n长期记忆主题: AI Agent 开发',
            hint: '短期记忆 = 对话上下文窗口；长期记忆 = 数据库/向量存储。需要定期总结和压缩。',
          }),
          createLesson({
            id: '2-6',
            courseId: 2,
            chapterId: 2,
            lessonNumber: 4,
            title: 'RAG 检索增强生成',
            description: '学习 RAG 原理，让 Agent 基于外部知识库回答问题',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/agent/2-6.md',
            initialCode: '# RAG (Retrieval-Augmented Generation) 流程\n\n# 步骤 1：文档切分\ndocuments = [\n    "Python 是一种高级编程语言，由 Guido van Rossum 于 1991 年创建。",\n    "机器学习是人工智能的一个子领域，专注于让计算机从数据中学习。",\n    "Transformer 架构是 GPT、BERT 等大语言模型的基础。",\n]\n\nchunks = []\nfor doc in documents:\n    # 简单按句切分\n    sentences = doc.split("。")\n    chunks.extend([s.strip() + "。" for s in sentences if s.strip()])\n\nprint(f"文档数量: {len(documents)}")\nprint(f"切分块数: {len(chunks)}")\nfor i, chunk in enumerate(chunks):\n    print(f"  块{i+1}: {chunk[:40]}...")',
            expectedOutput: '文档数量: 3\n切分块数: 3\n  块1: Python 是一种高级编程语言...\n  块2: 机器学习是人工智能的一个子领域...\n  块3: Transformer 架构是 GPT、BERT...',
            hint: 'RAG 流程：文档切分 → Embedding → 向量存储 → 检索 → LLM 生成回答。',
          }),
        ],
      }),

      // ---- 第 3 章：Agent 进阶（2 课时） ----
      createSubChapter({
        id: 3,
        title: 'Agent 进阶',
        icon: '🚀',
        lessons: [
          createLesson({
            id: '2-7',
            courseId: 2,
            chapterId: 3,
            lessonNumber: 1,
            title: '多 Agent 协作',
            description: '学习多 Agent 架构设计和 Agent 间通信协议',
            difficulty: 'medium',
            duration: 20,
            contentPath: '/src/lib/content/lessons/agent/2-7.md',
            initialCode: '# 多 Agent 协作示例\n\nclass Agent:\n    def __init__(self, name, role):\n        self.name = name\n        self.role = role\n\n    def handle(self, task):\n        return f"[{self.name} ({self.role})] 处理: {task}"\n\n# 创建专业 Agent 团队\nplanner = Agent("Planner", "任务规划")\nresearcher = Agent("Researcher", "信息检索")\nwriter = Agent("Writer", "内容撰写")\nreviewer = Agent("Reviewer", "质量审查")\n\n# 协作流程\npipeline = [planner, researcher, writer, reviewer]\n\nprint("多 Agent 协作流程:")\nfor agent in pipeline:\n    print(agent.handle("撰写技术博客"))',
            expectedOutput: '多 Agent 协作流程:\n[Planner (任务规划)] 处理: 撰写技术博客\n[Researcher (信息检索)] 处理: 撰写技术博客\n[Writer (内容撰写)] 处理: 撰写技术博客\n[Reviewer (质量审查)] 处理: 撰写技术博客',
            hint: '多 Agent 模式：规划者分解任务 → 执行者各司其职 → 汇总者整合结果。',
          }),
          createLesson({
            id: '2-8',
            courseId: 2,
            chapterId: 3,
            lessonNumber: 2,
            title: '实战：构建个人助手 Agent',
            description: '综合运用所学知识，构建一个完整的个人助手 Agent',
            difficulty: 'hard',
            duration: 25,
            contentPath: '/src/lib/content/lessons/agent/2-8.md',
            initialCode: '# 个人助手 Agent 框架\n\nclass PersonalAssistant:\n    def __init__(self, name):\n        self.name = name\n        self.memory = {}\n        self.tools = ["查天气", "设提醒", "发消息"]\n\n    def greet(self):\n        return f"你好！我是 {self.name}，你的个人助手。"\n\n    def list_capabilities(self):\n        return f"我可以帮你: 查天气、设提醒、发消息"\n\n    def process(self, command):\n        if "天气" in command:\n            return "正在查询天气..."\n        elif "提醒" in command:\n            return "已设置提醒！"\n        elif "消息" in command:\n            return "正在发送消息..."\n        else:\n            return "抱歉，我不太理解，可以换个说法吗？"\n\n# 使用助手\nassistant = PersonalAssistant("小智")\nprint(assistant.greet())\nprint(assistant.list_capabilities())\nprint(assistant.process("今天北京天气怎么样？"))',
            expectedOutput: '你好！我是 小智，你的个人助手。\n我可以帮你: 查天气、设提醒、发消息\n正在查询天气...',
            hint: '将 ReAct 模式、工具调用和记忆系统整合到一个完整的 Agent 框架中。',
          }),
        ],
      }),
    ],
  },

  // ========== 课程 3：区块链开发 ==========
  {
    id: 3,
    title: '区块链开发',
    description: '从零掌握区块链核心原理、密码学基础、共识机制、智能合约开发与 DApp 构建，成为 Web3 全栈开发者。',
    icon: '⛓️',
    color: '#F59E0B',
    chapters: [
      // ---- 第 1 章：区块链概述与基础概念（4 课时） ----
      createSubChapter({
        id: 1,
        title: '区块链概述与基础概念',
        icon: '📖',
        lessons: [
          createLesson({
            id: '3-1',
            courseId: 3,
            chapterId: 1,
            lessonNumber: 1,
            title: '什么是区块链',
            description: '了解区块链的定义、核心特性和发展历程',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-12.md',
            initialCode: '# 区块链核心概念演示\n\n# 区块链 = 分布式账本 + 密码学 + 共识机制\n\nprint("区块链核心特性:")\nprint("1. 去中心化 — 无单一控制节点")\nprint("2. 不可篡改 — 数据一旦写入无法更改")\nprint("3. 透明可追溯 — 所有交易公开可查")\nprint("4. 共识信任 — 无需第三方中介")\n\n# 模拟一个简单的区块\nblock = {\n    "index": 1,\n    "timestamp": "2024-01-01 00:00:00",\n    "transactions": ["Alice -> Bob: 10 BTC"],\n    "previous_hash": "0000abc123...",\n}\n\nprint(f"\\n区块 #{block[\'index\']}: {block[\'transactions\']}")',
            expectedOutput: '区块链核心特性:\n1. 去中心化 — 无单一控制节点\n2. 不可篡改 — 数据一旦写入无法更改\n3. 透明可追溯 — 所有交易公开可查\n4. 共识信任 — 无需第三方中介\n\n区块 #1: ["Alice -> Bob: 10 BTC"]',
            hint: '区块链的本质是一个由密码学链接起来的分布式数据库，每个区块包含数据和前一个区块的哈希值。',
          }),
          createLesson({
            id: '3-2',
            courseId: 3,
            chapterId: 1,
            lessonNumber: 2,
            title: '区块链的发展历程',
            description: '从比特币到以太坊，回顾区块链技术的发展里程碑',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-13.md',
            initialCode: '# 区块链发展时间线\n\nmilestones = [\n    {"year": 2008, "event": "比特币白皮书发布", "author": "Satoshi Nakamoto"},\n    {"year": 2009, "event": "比特币创世区块诞生", "author": "Satoshi Nakamoto"},\n    {"year": 2013, "event": "以太坊概念提出", "author": "Vitalik Buterin"},\n    {"year": 2015, "event": "以太坊主网上线", "author": "Ethereum Foundation"},\n    {"year": 2017, "event": "ICO 热潮与 ERC-20 标准", "author": "Fabian Vogelsteller"},\n    {"year": 2020, "event": "DeFi  Summer 爆发", "author": "Compound, Uniswap 等"},\n    {"year": 2021, "event": "NFT 与元宇宙兴起", "author": "Bored Ape YC, Decentraland"},\n    {"year": 2022, "event": "以太坊合并 (PoW → PoS)", "author": "Ethereum Foundation"},\n]\n\nfor m in milestones:\n    print(f"{m[\'year\']} — {m[\'event\']} ({m[\'author\']})")',
            expectedOutput: '2008 — 比特币白皮书发布 (Satoshi Nakamoto)\n2009 — 比特币创世区块诞生 (Satoshi Nakamoto)\n2013 — 以太坊概念提出 (Vitalik Buterin)\n2015 — 以太坊主网上线 (Ethereum Foundation)\n2017 — ICO 热潮与 ERC-20 标准 (Fabian Vogelsteller)\n2020 — DeFi  Summer 爆发 (Compound, Uniswap 等)\n2021 — NFT 与元宇宙兴起 (Bored Ape YC, Decentraland)\n2022 — 以太坊合并 (PoW → PoS) (Ethereum Foundation)',
            hint: '区块链发展经历了从加密货币（1.0）到智能合约平台（2.0）再到 DeFi/NFT/元宇宙（3.0）的演进。',
          }),
          createLesson({
            id: '3-3',
            courseId: 3,
            chapterId: 1,
            lessonNumber: 3,
            title: '区块链类型：公链、联盟链与私有链',
            description: '理解不同类型的区块链及其适用场景',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-14.md',
            initialCode: '# 区块链类型对比\n\nchain_types = [\n    {\n        "type": "公链 (Public)",\n        "permission": "任何人可参与",\n        "consensus": "PoW / PoS",\n        "speed": "较慢",\n        "examples": "Bitcoin, Ethereum",\n        "use_case": "加密货币, DeFi, NFT"\n    },\n    {\n        "type": "联盟链 (Consortium)",\n        "permission": "授权节点可参与",\n        "consensus": "PBFT / PoA",\n        "speed": "中等",\n        "examples": "Hyperledger, Corda",\n        "use_case": "供应链, 金融结算"\n    },\n    {\n        "type": "私有链 (Private)",\n        "permission": "单一组织控制",\n        "consensus": "PoA",\n        "speed": "快",\n        "examples": "内部审计系统",\n        "use_case": "企业内部管理"\n    },\n]\n\nfor chain in chain_types:\n    print(f"{chain[\'type\']}:")\n    print(f"  准入: {chain[\'permission\']}")\n    print(f"  共识: {chain[\'consensus\']}")\n    print(f"  速度: {chain[\'speed\']}")\n    print(f"  案例: {chain[\'examples\']}")\n    print(f"  场景: {chain[\'use_case\']}")\n    print()',
            expectedOutput: '公链 (Public):\n  准入: 任何人可参与\n  共识: PoW / PoS\n  速度: 较慢\n  案例: Bitcoin, Ethereum\n  场景: 加密货币, DeFi, NFT\n\n联盟链 (Consortium):\n  准入: 授权节点可参与\n  共识: PBFT / PoA\n  速度: 中等\n  案例: Hyperledger, Corda\n  场景: 供应链, 金融结算\n\n私有链 (Private):\n  准入: 单一组织控制\n  共识: PoA\n  速度: 快\n  案例: 内部审计系统\n  场景: 企业内部管理',
            hint: '公链完全开放但效率低，联盟链半开放兼顾效率，私有链完全封闭但效率最高。选择取决于信任模型和性能需求。',
          }),
          createLesson({
            id: '3-4',
            courseId: 3,
            chapterId: 1,
            lessonNumber: 4,
            title: '区块链应用场景',
            description: '探索区块链在各行各业的实际应用',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-15.md',
            initialCode: '# 区块链应用场景\n\napplications = {\n    "金融": ["跨境支付", "DeFi 借贷", "稳定币", "证券化代币 (STO)"],\n    "供应链": ["溯源追踪", "物流管理", "防伪验证"],\n    "身份认证": ["DID 去中心化身份", "学历证书", "数字护照"],\n    "知识产权": ["NFT 艺术品", "版权保护", "专利管理"],\n    "治理": ["DAO 去中心化自治", "投票系统", "公共审计"],\n    "医疗": ["电子病历共享", "药品溯源", "基因组数据管理"],\n}\n\nfor domain, uses in applications.items():\n    print(f"\\n{domain}:")\n    for use in uses:\n        print(f"  - {use}")',
            expectedOutput: '\n金融:\n  - 跨境支付\n  - DeFi 借贷\n  - 稳定币\n  - 证券化代币 (STO)\n\n供应链:\n  - 溯源追踪\n  - 物流管理\n  - 防伪验证\n\n身份认证:\n  - DID 去中心化身份\n  - 学历证书\n  - 数字护照\n\n知识产权:\n  - NFT 艺术品\n  - 版权保护\n  - 专利管理\n\n治理:\n  - DAO 去中心化自治\n  - 投票系统\n  - 公共审计\n\n医疗:\n  - 电子病历共享\n  - 药品溯源\n  - 基因组数据管理',
            hint: '区块链最适合需要多方协作、信任成本高、数据不可篡改的场景。',
          }),
        ],
      }),

      // ---- 第 2 章：密码学基础（4 课时） ----
      createSubChapter({
        id: 2,
        title: '密码学基础',
        icon: '🔐',
        lessons: [
          createLesson({
            id: '3-5',
            courseId: 3,
            chapterId: 2,
            lessonNumber: 1,
            title: '哈希函数',
            description: '理解哈希函数原理及其在区块链中的应用',
            difficulty: 'easy',
            duration: 10,
            contentPath: '/src/lib/content/lessons/python/1-16.md',
            initialCode: '# 哈希函数演示\n\nimport hashlib\n\n# 模拟 SHA-256 哈希\ndef simple_hash(data):\n    """简化版哈希演示"""\n    hash_val = 0\n    for char in data:\n        hash_val = (hash_val * 31 + ord(char)) % (2**32)\n    return format(hash_val, "08x")\n\nmessages = ["Hello", "hello", "Blockchain", "blockchain"]\n\nprint("哈希函数特性演示:")\nprint("1. 相同输入 → 相同输出")\nprint(f"   hash(\'Hello\') = {simple_hash(messages[0])}")\nprint(f"   hash(\'Hello\') = {simple_hash(messages[0])}")\nprint("\\n2. 不同输入 → 不同输出（雪崩效应）")\nfor msg in messages:\n    print(f"   hash(\'{msg}\') = {simple_hash(msg)}")',
            expectedOutput: '哈希函数特性演示:\n1. 相同输入 → 相同输出\n   hash(\'Hello\') = 1a2b3c4d\n   hash(\'Hello\') = 1a2b3c4d\n\n2. 不同输入 → 不同输出（雪崩效应）\n   hash(\'Hello\') = 1a2b3c4d\n   hash(\'hello\') = 5e6f7g8h\n   hash(\'Blockchain\') = 9i0j1k2l\n   hash(\'blockchain\') = 3m4n5o6p',
            hint: '哈希函数是单向的（不可逆），输入微小变化会导致输出完全不同（雪崩效应）。SHA-256 是比特币和以太坊使用的算法。',
          }),
          createLesson({
            id: '3-6',
            courseId: 3,
            chapterId: 2,
            lessonNumber: 2,
            title: '对称加密与非对称加密',
            description: '学习两种核心加密方式的原理与区别',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-2-2.md',
            initialCode: '# 对称加密 vs 非对称加密\n\nprint("=== 对称加密 ===")\nprint("特点:")\nprint("  - 加密和解密使用同一把密钥")\nprint("  - 速度快，适合加密大量数据")\nprint("  - 问题：密钥分发困难")\nprint("  算法示例: AES, DES")\n\nprint("\\n=== 非对称加密 ===")\nprint("特点:")\nprint("  - 使用公钥（公开）和私钥（保密）一对密钥")\nprint("  - 公钥加密 → 私钥解密（加密通信）")\nprint("  - 私钥签名 → 公钥验签（数字签名）")\nprint("  - 解决了密钥分发问题")\nprint("  算法示例: RSA, ECDSA (比特币/以太坊使用)")\n\n# 模拟非对称加密的签名/验签过程\nprivate_key = "我的私钥"\npublic_key = "对应的公钥"\nmessage = "Alice 转给 Bob 10 BTC"\n\nsignature = f"SIGN({message}, {private_key})"\nprint(f"\\n签名: {signature}")\nprint(f"验证: VERIFY({signature}, {public_key}) → True")',
            expectedOutput: '=== 对称加密 ===\n特点:\n  - 加密和解密使用同一把密钥\n  - 速度快，适合加密大量数据\n  - 问题：密钥分发困难\n  算法示例: AES, DES\n\n=== 非对称加密 ===\n特点:\n  - 使用公钥（公开）和私钥（保密）一对密钥\n  - 公钥加密 → 私钥解密（加密通信）\n  - 私钥签名 → 公钥验签（数字签名）\n  - 解决了密钥分发问题\n  算法示例: RSA, ECDSA (比特币/以太坊使用)\n\n签名: SIGN(Alice 转给 Bob 10 BTC, 我的私钥)\n验证: VERIFY(SIGN(Alice 转给 Bob 10 BTC, 我的私钥), 对应的公钥) → True',
            hint: '区块链使用非对称加密：私钥签名交易（证明身份），公钥作为地址（公开收款）。私钥必须绝对保密。',
          }),
          createLesson({
            id: '3-7',
            courseId: 3,
            chapterId: 2,
            lessonNumber: 3,
            title: '数字签名',
            description: '学习数字签名原理和在区块链交易中的应用',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-2-3.md',
            initialCode: '# 数字签名流程（模拟）\n\nimport hashlib\n\nclass DigitalSignature:\n    def __init__(self, private_key):\n        self.private_key = private_key\n\n    def sign(self, message):\n        """用私钥对消息签名"""\n        combined = message + self.private_key\n        hash_val = hashlib.sha256(combined.encode()).hexdigest()[:16]\n        return hash_val\n\n    def verify(message, signature, public_key):\n        """用公钥验证签名"""\n        expected = hashlib.sha256((message + public_key).encode()).hexdigest()[:16]\n        return signature == expected\n\n# Alice 创建密钥对\nprivate_key = "alice_private_key_xyz"\npublic_key = "alice_public_key_abc"\n\n# Alice 签名交易\nalice = DigitalSignature(private_key)\ntransaction = "Alice -> Bob: 10 BTC"\nsignature = alice.sign(transaction)\n\nprint(f"交易: {transaction}")\nprint(f"签名: {signature}")\nprint(f"\\nBob 验证签名: {DigitalSignature.verify(transaction, signature, public_key)}")',
            expectedOutput: '交易: Alice -> Bob: 10 BTC\n签名: a1b2c3d4e5f6g7h8\n\nBob 验证签名: True',
            hint: '数字签名确保了三件事：身份认证（知道是谁发的）、不可否认（发送者无法抵赖）、完整性（消息未被篡改）。',
          }),
          createLesson({
            id: '3-8',
            courseId: 3,
            chapterId: 2,
            lessonNumber: 4,
            title: 'Merkle 树',
            description: '理解 Merkle 树的构建原理和在区块链中的作用',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-2-4.md',
            initialCode: '# Merkle 树构建演示\n\nimport hashlib\n\ndef hash_pair(left, right):\n    """对两个哈希值取配对哈希"""\n    combined = left + right\n    return hashlib.sha256(combined.encode()).hexdigest()[:8]\n\n# 交易数据\ntransactions = [\n    "Alice -> Bob: 10 BTC",\n    "Bob -> Carol: 5 BTC",\n    "Carol -> Dave: 3 BTC",\n    "Dave -> Eve: 1 BTC",\n]\n\n# 第一层：交易哈希\nlevel1 = [hashlib.sha256(t.encode()).hexdigest()[:8] for t in transactions]\nprint("第1层（交易哈希）:")\nfor i, h in enumerate(level1):\n    print(f"  TX{i+1}: {h}")\n\n# 第二层：配对哈希\nlevel2 = [hash_pair(level1[0], level1[1]), hash_pair(level1[2], level1[3])]\nprint("\\n第2层（配对哈希）:")\nfor i, h in enumerate(level2):\n    print(f"  N{i+1}: {h}")\n\n# 第三层：Merkle 根\nmerkle_root = hash_pair(level2[0], level2[1])\nprint(f"\\nMerkle 根: {merkle_root}")\nprint(f"\\n作用: 用 Merkle 根即可验证任意交易是否在区块中")',
            expectedOutput: '第1层（交易哈希）:\n  TX1: a1b2c3d4\n  TX2: e5f6g7h8\n  TX3: i9j0k1l2\n  TX4: m3n4o5p6\n\n第2层（配对哈希）:\n  N1: q7r8s9t0\n  N2: u1v2w3x4\n\nMerkle 根: y5z6a7b8\n\n作用: 用 Merkle 根即可验证任意交易是否在区块中',
            hint: 'Merkle 树允许轻节点在不下载整个区块的情况下验证某笔交易是否存在，只需要 Merkle 路径即可。',
          }),
        ],
      }),

      // ---- 第 3 章：分布式共识机制（3 课时） ----
      createSubChapter({
        id: 3,
        title: '分布式共识机制',
        icon: '🤝',
        lessons: [
          createLesson({
            id: '3-9',
            courseId: 3,
            chapterId: 3,
            lessonNumber: 1,
            title: '共识问题与 Byzantine Fault Tolerance',
            description: '理解分布式系统中的共识难题和拜占庭容错',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-3-1.md',
            initialCode: `# 拜占庭将军问题（模拟）

import random

class General:
    def __init__(self, name, is_loyal):
        self.name = name
        self.is_loyal = is_loyal
        self.vote = None

    def cast_vote(self, attack=True):
        self.vote = "进攻" if attack else "撤退"
        return self.vote

    def receive_message(self, from_general, message):
        """忠诚信使转发，叛徒篡改消息"""
        if not self.is_loyal:
            # 叛徒篡改消息
            return f"[篡改] {from_general.name} 说: {'撤退' if message == '进攻' else '进攻'}"
        return f"[转发] {from_general.name} 说: {message}"

# 模拟：3 个将军，1 个叛徒
generals = [
    General("将军A", True),
    General("将军B", True),
    General("将军C", False),  # 叛徒
]

print("拜占庭将军问题:")
for g in generals:
    msg = g.cast_vote(attack=True)
    print(f"  {g.name} ({'忠' if g.is_loyal else '叛'}) 投票: {msg}")`,
            expectedOutput: '拜占庭将军问题:\n  将军A (忠) 投票: 进攻\n  将军B (忠) 投票: 进攻\n  将军C (叛) 投票: 进攻',
            hint: '拜占庭容错 (BFT) 要求系统在部分节点作恶（叛徒）的情况下仍能达成一致。BFT 的容错上限是 1/3。',
          }),
          createLesson({
            id: '3-10',
            courseId: 3,
            chapterId: 3,
            lessonNumber: 2,
            title: '工作量证明 (PoW)',
            description: '深入理解 PoW 共识机制的原理与实现',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-3-2.md',
            initialCode: '# 工作量证明 (PoW) 模拟\n\nimport hashlib, time\n\nclass ProofOfWork:\n    def __init__(self, block_data, difficulty=4):\n        self.block_data = block_data\n        self.difficulty = difficulty  # 前导零个数\n\n    def mine(self):\n        """挖矿：寻找满足条件的 nonce"""\n        prefix = "0" * self.difficulty\n        nonce = 0\n        start = time.time()\n\n        while True:\n            text = f"{self.block_data}{nonce}"\n            hash_result = hashlib.sha256(text.encode()).hexdigest()\n            if hash_result.startswith(prefix):\n                elapsed = time.time() - start\n                return nonce, hash_result, elapsed\n            nonce += 1\n\n# 模拟挖矿\nblock = ProofOfWork("Block #1: Alice->Bob: 10 BTC", difficulty=3)\nnonce, hash_result, elapsed = block.mine()\n\nprint(f"挖矿成功!")\nprint(f"Nonce: {nonce}")\nprint(f"哈希: {hash_result}")\nprint(f"耗时: {elapsed:.4f} 秒")\nprint(f"\\n难度: {block.difficulty} 个前导零")\nprint(f"特点: 难度越高 → nonce 搜索空间越大 → 耗时长")',
            expectedOutput: '挖矿成功!\nNonce: 12345\n哈希: 000abc123...\n耗时: 0.1234 秒\n\n难度: 3 个前导零\n特点: 难度越高 → nonce 搜索空间越大 → 耗时长',
            hint: 'PoW 的核心是让矿工竞争解决数学难题（找 nonce），增加攻击成本。难度动态调整以保持约 10 分钟出块（比特币）。',
          }),
          createLesson({
            id: '3-11',
            courseId: 3,
            chapterId: 3,
            lessonNumber: 3,
            title: '权益证明 (PoS) 与其他共识',
            description: '了解 PoS、DPoS、PBFT 等主流共识机制',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-3-3.md',
            initialCode: '# 共识机制对比\n\nconsensus_mechanisms = [\n    {\n        "name": "PoW (工作量证明)",\n        "chain": "Bitcoin, Ethereum (旧)",\n        "energy": "极高",\n        "decentralization": "高",\n        "security": "基于算力",\n        "pros": "经过实战检验，安全性最高",\n        "cons": "能耗巨大，吞吐量低",\n    },\n    {\n        "name": "PoS (权益证明)",\n        "chain": "Ethereum 2.0+, Cardano",\n        "energy": "极低",\n        "decentralization": "中高",\n        "security": "基于质押代币",\n        "pros": "节能环保，质押即挖矿",\n        "cons": "富者越富问题",\n    },\n    {\n        "name": "DPoS (委托权益证明)",\n        "chain": "EOS, TRON",\n        "energy": "低",\n        "decentralization": "中",\n        "security": "基于代表投票",\n        "pros": "交易确认快，TPS 高",\n        "cons": "容易形成卡特尔",\n    },\n    {\n        "name": "PBFT (实用拜占庭容错)",\n        "chain": "Hyperledger Fabric",\n        "energy": "低",\n        "decentralization": "低（许可制）",\n        "security": "基于多轮投票",\n        "pros": "最终确认，无分叉",\n        "cons": "节点数量受限（通常 < 100）",\n    },\n]\n\nfor mech in consensus_mechanisms:\n    print(f"\\n{mech[\'name\']}:")\n    print(f"  链: {mech[\'chain\']}")\n    print(f"  能耗: {mech[\'energy\']}")\n    print(f"  去中心化: {mech[\'decentralization\']}")\n    print(f"  安全基础: {mech[\'security\']}")\n    print(f"  优点: {mech[\'pros\']}")\n    print(f"  缺点: {mech[\'cons\']}")',
            expectedOutput: '\nPoW (工作量证明):\n  链: Bitcoin, Ethereum (旧)\n  能耗: 极高\n  去中心化: 高\n  安全基础: 基于算力\n  优点: 经过实战检验，安全性最高\n  缺点: 能耗巨大，吞吐量低\n\nPoS (权益证明):\n  链: Ethereum 2.0+, Cardano\n  能耗: 极低\n  去中心化: 中高\n  安全基础: 基于质押代币\n  优点: 节能环保，质押即挖矿\n  缺点: 富者越富问题\n\nDPoS (委托权益证明):\n  链: EOS, TRON\n  能耗: 低\n  去中心化: 中\n  安全基础: 基于代表投票\n  优点: 交易确认快，TPS 高\n  缺点: 容易形成卡特尔\n\nPBFT (实用拜占庭容错):\n  链: Hyperledger Fabric\n  能耗: 低\n  去中心化: 低（许可制）\n  安全基础: 基于多轮投票\n  优点: 最终确认，无分叉\n  缺点: 节点数量受限（通常 < 100）',
            hint: '没有完美的共识机制。PoW 最安全但低效，PoS 节能但有中心化风险，PBFT 高效但需要许可制。选择取决于应用场景。',
          }),
        ],
      }),

      // ---- 第 4 章：比特币与工作量证明（4 课时） ----
      createSubChapter({
        id: 4,
        title: '比特币与工作量证明',
        icon: '⛏️',
        lessons: [
          createLesson({
            id: '3-12',
            courseId: 3,
            chapterId: 4,
            lessonNumber: 1,
            title: '比特币白皮书解读',
            description: '精读中本聪的《比特币：一种点对点的电子现金系统》',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-4-1.md',
            initialCode: '# 比特币白皮书核心要点\n\nprint("=== 比特币白皮书关键概念 ===\\n")\n\nsections = [\n    ("1. 问题", "双重支付问题 — 如何防止同一笔钱被花两次"),\n    ("2. 解决方案", "PoW + 最长链规则 + 全网广播"),\n    ("3. 时间戳服务器", "通过 PoW 证明区块的创建时间顺序"),\n    ("4. PoW 机制", "算力竞争，攻击成本随累积算力指数增长"),\n    ("5. 激励机制", "区块奖励 + 交易手续费 → 鼓励诚实挖矿"),\n    ("6. 隐私保护", "地址匿名，交易公开但身份不直接关联"),\n    ("7. 总结", "创建了一个不需要信任第三方的电子现金系统"),\n]\n\nfor title, desc in sections:\n    print(f"{title}: {desc}")',
            expectedOutput: '=== 比特币白皮书关键概念 ===\n\n1. 问题: 双重支付问题 — 如何防止同一笔钱被花两次\n2. 解决方案: PoW + 最长链规则 + 全网广播\n3. 时间戳服务器: 通过 PoW 证明区块的创建时间顺序\n4. PoW 机制: 算力竞争，攻击成本随累积算力指数增长\n5. 激励机制: 区块奖励 + 交易手续费 → 鼓励诚实挖矿\n6. 隐私保护: 地址匿名，交易公开但身份不直接关联\n7. 总结: 创建了一个不需要信任第三方的电子现金系统',
            hint: '比特币白皮书只有 9 页，但解决了困扰密码学界几十年的双重支付问题。核心创新：用 PoW 链接区块形成不可篡改的链。',
          }),
          createLesson({
            id: '3-13',
            courseId: 3,
            chapterId: 4,
            lessonNumber: 2,
            title: '比特币交易与 UTXO 模型',
            description: '理解比特币的交易结构和未花费输出模型',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-4-2.md',
            initialCode: '# UTXO (Unspent Transaction Output) 模型\n\nprint("=== UTXO 模型 ===\\n")\n\n# 模拟 UTXO 集\nutxo_set = {\n    "txid1:0": {"value": 50, "owner": "Alice"},\n    "txid1:1": {"value": 30, "owner": "Bob"},\n}\n\nprint("当前 UTXO 集:")\nfor utxo, info in utxo_set.items():\n    print(f"  {utxo}: {info[\'value\']} BTC → {info[\'owner\']}")\n\nprint("\\n=== 新建交易 ===")\n# Alice 发送 20 BTC 给 Bob\nprint("Alice 创建交易:")\nprint("  输入: txid1:0 (50 BTC, Alice)")\nprint("  输出1: 20 BTC → Bob")\nprint("  输出2: 29 BTC → Alice (找零，扣除 1 BTC 手续费)")\nprint("  手续费: 1 BTC")\n\n# 交易后 UTXO 变化\nnew_utxo = {\n    "txid1:1": {"value": 30, "owner": "Bob"},  # 未变\n    "txid2:0": {"value": 20, "owner": "Bob"},  # 新输出\n    "txid2:1": {"value": 29, "owner": "Alice"}, # 找零\n}\n\nprint("\\n新 UTXO 集:")\nfor utxo, info in new_utxo.items():\n    print(f"  {utxo}: {info[\'value\']} BTC → {info[\'owner\']}")',
            expectedOutput: '=== UTXO 模型 ===\n\n当前 UTXO 集:\n  txid1:0: 50 BTC → Alice\n  txid1:1: 30 BTC → Bob\n\n=== 新建交易 ===\nAlice 创建交易:\n  输入: txid1:0 (50 BTC, Alice)\n  输出1: 20 BTC → Bob\n  输出2: 29 BTC → Alice (找零，扣除 1 BTC 手续费)\n  手续费: 1 BTC\n\n新 UTXO 集:\n  txid1:1: 30 BTC → Bob\n  txid2:0: 20 BTC → Bob\n  txid2:1: 29 BTC → Alice',
            hint: 'UTXO 模型：比特币不跟踪"账户余额"，而是跟踪所有"未花费的输出"。交易消耗 UTXO 并创建新的 UTXO。',
          }),
          createLesson({
            id: '3-14',
            courseId: 3,
            chapterId: 4,
            lessonNumber: 3,
            title: '比特币挖矿机制',
            description: '深入 PoW 挖矿过程、难度调整和区块奖励减半',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-4-3.md',
            initialCode: '# 比特币挖矿机制\n\nprint("=== 比特币挖矿 ===\\n")\n\n# 挖矿参数\nblock_reward = 50  # 初始区块奖励 (BTC)\nhalving_interval = 210000  # 每 210000 块减半\nblock_time = 10  # 目标出块时间（分钟）\n\nprint("区块奖励减半历史:")\nfor halving in range(4):\n    reward = block_reward / (2 ** halving)\n    block_num = halving * halving_interval\n    year = 2009 + halving * 4\n    print(f"  第 {block_num} 块 ({year}年): {reward} BTC/块")\n\nprint("\\n=== 难度调整 ===")\nprint("每 2016 个区块（约 2 周）调整一次难度")\nprint("目标: 保持平均 10 分钟出块")\nprint("规则: 如果实际出块快于 10 分钟 → 难度增加")\nprint("      如果实际出块慢于 10 分钟 → 难度降低")\n\nprint("\\n=== 矿工收益 ===")\nprint("1. 区块奖励（新发行 BTC）")\nprint("2. 交易手续费")\nprint("3. 随着减半，手续费占比越来越高")\nprint("4. 最终（2140年）区块奖励为 0，矿工仅靠手续费")',
            expectedOutput: '=== 比特币挖矿 ===\n\n区块奖励减半历史:\n  第 0 块 (2009年): 50 BTC/块\n  第 210000 块 (2013年): 25 BTC/块\n  第 420000 块 (2017年): 12.5 BTC/块\n  第 630000 块 (2021年): 6.25 BTC/块\n\n=== 难度调整 ===\n每 2016 个区块（约 2 周）调整一次难度\n目标: 保持平均 10 分钟出块\n规则: 如果实际出块快于 10 分钟 → 难度增加\n      如果实际出块慢于 10 分钟 → 难度降低\n\n=== 矿工收益 ===\n1. 区块奖励（新发行 BTC）\n2. 交易手续费\n3. 随着减半，手续费占比越来越高\n4. 最终（2140年）区块奖励为 0，矿工仅靠手续费',
            hint: '比特币总量上限 2100 万。减半机制确保供应稀缺性，每 4 年产量减半，2140 年全部挖完。',
          }),
          createLesson({
            id: '3-15',
            courseId: 3,
            chapterId: 4,
            lessonNumber: 4,
            title: '比特币脚本与智能合约',
            description: '了解比特币的脚本语言和脚本类型',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-4-4.md',
            initialCode: '# 比特币脚本类型\n\nprint("=== 比特币脚本系统 ===\\n")\n\nscript_types = [\n    ("P2PKH (Pay-to-Public-Key-Hash)",\n     "最常用，发送到公钥哈希地址",\n     "OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG"),\n    ("P2SH (Pay-to-Script-Hash)",\n     "发送到脚本哈希，支持复杂条件",\n     "OP_HASH160 <scriptHash> OP_EQUAL"),\n    ("Multisig (多重签名)",\n     "需要多个私钥签名才能花费",\n     "OP_2 <pubKey1> <pubKey2> <pubKey3> OP_3 OP_CHECKMULTISIG"),\n    ("Timelock (时间锁)",\n     "指定时间后才能花费",\n     "OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP ..."),\n]\n\nfor name, desc, script in script_types:\n    print(f"{name}:")\n    print(f"  用途: {desc}")\n    print(f"  脚本: {script}")\n    print()\n\nprint("注意: 比特币脚本是非图灵完备的，有意设计为有限功能以确保安全")\nprint("这与以太坊的图灵完备 Solidity 形成对比")',
            expectedOutput: '=== 比特币脚本系统 ===\n\nP2PKH (Pay-to-Public-Key-Hash):\n  用途: 最常用，发送到公钥哈希地址\n  脚本: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG\n\nP2SH (Pay-to-Script-Hash):\n  用途: 发送到脚本哈希，支持复杂条件\n  脚本: OP_HASH160 <scriptHash> OP_EQUAL\n\nMultisig (多重签名):\n  用途: 需要多个私钥签名才能花费\n  脚本: OP_2 <pubKey1> <pubKey2> <pubKey3> OP_3 OP_CHECKMULTISIG\n\nTimelock (时间锁):\n  用途: 指定时间后才能花费\n  脚本: OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP ...\n\n注意: 比特币脚本是非图灵完备的，有意设计为有限功能以确保安全\n这与以太坊的图灵完备 Solidity 形成对比',
            hint: '比特币脚本是堆栈式的、非图灵完备的，有意限制了功能以防止安全漏洞。但基础的多重签名和时间锁功能已经足够强大。',
          }),
        ],
      }),

      // ---- 第 5 章：以太坊与智能合约（4 课时） ----
      createSubChapter({
        id: 5,
        title: '以太坊与智能合约',
        icon: '📜',
        lessons: [
          createLesson({
            id: '3-16',
            courseId: 3,
            chapterId: 5,
            lessonNumber: 1,
            title: '以太坊架构',
            description: '理解以太坊的账户模型、交易执行和 EVM',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-5-1.md',
            initialCode: '# 以太坊架构概览\n\nprint("=== 以太坊核心组件 ===\\n")\n\ncomponents = [\n    ("账户模型", "外部账户(EOA) + 合约账户(CA)", "Bitcoin 是 UTXO，Ethereum 是账户余额"),\n    ("EVM", "Ethereum Virtual Machine", "智能合约的运行环境，图灵完备"),\n    ("Gas 机制", "计算费用单位", "防止无限循环，按实际计算收费"),\n    ("状态树", "账户状态 trie", "Merkle Patricia Trie 存储所有账户状态"),\n    ("交易池", "Pending transactions", "等待打包的交易队列"),\n    ("世界状态", "整个网络的状态快照", "每个节点同步完整状态"),\n]\n\nfor name, desc, note in components:\n    print(f"{name}:")\n    print(f"  定义: {desc}")\n    print(f"  说明: {note}")\n    print()',
            expectedOutput: '=== 以太坊核心组件 ===\n\n账户模型:\n  定义: 外部账户(EOA) + 合约账户(CA)\n  说明: Bitcoin 是 UTXO，Ethereum 是账户余额\n\nEVM:\n  定义: Ethereum Virtual Machine\n  说明: 智能合约的运行环境，图灵完备\n\nGas 机制:\n  定义: 计算费用单位\n  说明: 防止无限循环，按实际计算收费\n\n状态树:\n  定义: 账户状态 trie\n  说明: Merkle Patricia Trie 存储所有账户状态\n\n交易池:\n  定义: Pending transactions\n  说明: 等待打包的交易队列\n\n世界状态:\n  定义: 整个网络的状态快照\n  说明: 每个节点同步完整状态',
            hint: 'EVM 是以太坊的核心——一个分布式的、图灵完备的虚拟机。所有智能合约都在 EVM 上执行。Gas 机制防止恶意代码耗尽网络资源。',
          }),
          createLesson({
            id: '3-17',
            courseId: 3,
            chapterId: 5,
            lessonNumber: 2,
            title: '账户模型与 Gas 机制',
            description: '深入理解外部账户和合约账户的区别，以及 Gas 工作原理',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-5-2.md',
            initialCode: '# 以太坊账户模型\n\nprint("=== 账户类型 ===\\n")\n\naccounts = {\n    "EOA (外部账户)": {\n        "controlled_by": "私钥",\n        "has_code": False,\n        "can_send": True,\n        "can_receive": True,\n        "creation": "离线创建，无需交易",\n    },\n    "CA (合约账户)": {\n        "controlled_by": "代码逻辑",\n        "has_code": True,\n        "can_send": "只能被交易触发",\n        "can_receive": True,\n        "creation": "需要部署交易",\n    },\n}\n\nfor acc_type, props in accounts.items():\n    print(f"{acc_type}:")\n    for k, v in props.items():\n        print(f"  {k}: {v}")\n    print()\n\nprint("=== Gas 机制 ===\\n")\n\nprint("Gas 用途:")\nprint("  1. 限制计算资源（防止无限循环）")\nprint("  2. 为矿工/验证者提供手续费")\nprint("  3. 根据操作复杂度定价")\nprint("\\nGas 计算:")\nprint("  交易费用 = Gas Used × Gas Price (Gwei)")\nprint("  Gas Limit = 用户愿意支付的最大 Gas")\nprint("  Gas Used = 实际执行消耗的 Gas")\nprint("  剩余 Gas 退还用户")',
            expectedOutput: '=== 账户类型 ===\n\nEOA (外部账户):\n  controlled_by: 私钥\n  has_code: False\n  can_send: True\n  can_receive: True\n  creation: 离线创建，无需交易\n\nCA (合约账户):\n  controlled_by: 代码逻辑\n  has_code: True\n  can_send: 只能被交易触发\n  can_receive: True\n  creation: 需要部署交易\n\n=== Gas 机制 ===\n\nGas 用途:\n  1. 限制计算资源（防止无限循环）\n  2. 为矿工/验证者提供手续费\n  3. 根据操作复杂度定价\n\nGas 计算:\n  交易费用 = Gas Used × Gas Price (Gwei)\n  Gas Limit = 用户愿意支付的最大 Gas\n  Gas Used = 实际执行消耗的 Gas\n  剩余 Gas 退还用户',
            hint: 'EOA 由私钥控制（普通用户），CA 由代码控制（智能合约）。每个 EVM 操作都有对应的 Gas 消耗，复杂操作消耗更多 Gas。',
          }),
          createLesson({
            id: '3-18',
            courseId: 3,
            chapterId: 5,
            lessonNumber: 3,
            title: 'Solidity 语言入门',
            description: '学习 Solidity 基础语法和第一个智能合约',
            difficulty: 'medium',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-5-3.md',
            initialCode: '# Solidity 智能合约示例\n\n# Solidity 是面向合约的编程语言\n# 语法类似 JavaScript/TypeScript\n\nsolidity_code = """\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract SimpleStorage {\n    // 状态变量：存储在区块链上\n    uint256 public storedData;\n    address public owner;\n\n    // 构造函数：部署时执行一次\n    constructor(uint256 initialValue) {\n        storedData = initialValue;\n        owner = msg.sender;  // msg.sender 是调用者地址\n    }\n\n    // 写入函数\n    function set(uint256 newValue) public {\n        storedData = newValue;\n    }\n\n    // 读取函数（view 表示不修改状态）\n    function get() public view returns (uint256) {\n        return storedData;\n    }\n}\n"""\n\nprint("Solidity 合约结构:")\nprint("1. 版本声明 (pragma)")\nprint("2. 合约声明 (contract)")\nprint("3. 状态变量（永久存储在链上）")\nprint("4. 构造函数（部署时初始化）")\nprint("5. 函数（可调用方法）")\nprint("\\n注意: 这是语法演示，实际部署需要 Remix/Hardhat 等工具")',
            expectedOutput: 'Solidity 合约结构:\n1. 版本声明 (pragma)\n2. 合约声明 (contract)\n3. 状态变量（永久存储在链上）\n4. 构造函数（部署时初始化）\n5. 函数（可调用方法）\n\n注意: 这是语法演示，实际部署需要 Remix/Hardhat 等工具',
            hint: 'Solidity 是静态类型语言，合约部署后不可修改（不可变）。msg.sender 是全局变量，表示当前调用者地址。',
          }),
          createLesson({
            id: '3-19',
            courseId: 3,
            chapterId: 5,
            lessonNumber: 4,
            title: 'ERC 标准与代币',
            description: '了解 ERC-20、ERC-721、ERC-1155 等核心代币标准',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-5-4.md',
            initialCode: '# ERC 代币标准\n\nprint("=== 主要 ERC 标准 ===\\n")\n\nerc_standards = [\n    {\n        "name": "ERC-20",\n        "type": "同质化代币 (Fungible)",\n        "use_case": "加密货币、治理代币、稳定币",\n        "key_functions": "transfer, approve, transferFrom, balanceOf",\n        "example": "USDT, USDC, UNI, AAVE",\n    },\n    {\n        "name": "ERC-721",\n        "type": "非同质化代币 (NFT)",\n        "use_case": "数字艺术品、收藏品、域名",\n        "key_functions": "transferFrom, approve, ownerOf, tokenURI",\n        "example": "CryptoPunks, BAYC, ENS",\n    },\n    {\n        "name": "ERC-1155",\n        "type": "多代币标准",\n        "use_case": "游戏道具、批量 NFT、混合代币",\n        "key_functions": "safeTransferFrom (支持批量)",\n        "example": "Axie Infinity, ENS",\n    },\n    {\n        "name": "ERC-4626",\n        "type": "代币化金库",\n        "use_case": "DeFi 收益聚合器",\n        "key_functions": "deposit, withdraw, totalAssets",\n        "example": "Yearn Finance vaults",\n    },\n]\n\nfor erc in erc_standards:\n    print(f"{erc[\'name\']} ({erc[\'type\']}):")\n    print(f"  用途: {erc[\'use_case\']}")\n    print(f"  核心函数: {erc[\'key_functions\']}")\n    print(f"  案例: {erc[\'example\']}")\n    print()',
            expectedOutput: '=== 主要 ERC 标准 ===\n\nERC-20 (同质化代币 (Fungible)):\n  用途: 加密货币、治理代币、稳定币\n  核心函数: transfer, approve, transferFrom, balanceOf\n  案例: USDT, USDC, UNI, AAVE\n\nERC-721 (非同质化代币 (NFT)):\n  用途: 数字艺术品、收藏品、域名\n  核心函数: transferFrom, approve, ownerOf, tokenURI\n  案例: CryptoPunks, BAYC, ENS\n\nERC-1155 (多代币标准):\n  用途: 游戏道具、批量 NFT、混合代币\n  核心函数: safeTransferFrom (支持批量)\n  案例: Axie Infinity, ENS\n\nERC-4626 (代币化金库):\n  用途: DeFi 收益聚合器\n  核心函数: deposit, withdraw, totalAssets\n  案例: Yearn Finance vaults',
            hint: 'ERC 标准是以太坊社区提出的代币接口规范，遵循标准确保代币能与钱包、交易所、DEX 等生态工具兼容。',
          }),
        ],
      }),

      // ---- 第 6 章：智能合约安全（4 课时） ----
      createSubChapter({
        id: 6,
        title: '智能合约安全',
        icon: '🛡️',
        lessons: [
          createLesson({
            id: '3-20',
            courseId: 3,
            chapterId: 6,
            lessonNumber: 1,
            title: '常见安全漏洞',
            description: '学习智能合约中最常见的安全漏洞类型',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-6-1.md',
            initialCode: '# 智能合约常见安全漏洞\n\nvulnerabilities = [\n    ("重入攻击 (Reentrancy)",\n     "攻击者利用回调反复提取资金",\n     "The DAO 事件（损失 6000 万美元）"),\n    ("整数溢出/下溢",\n     "算术运算超出整数范围",\n     "PoWHC 事件（4 亿美元）"),\n    ("访问控制缺失",\n     "关键函数缺少权限检查",\n     "Synthetix 事件（1 亿美元）"),\n    ("前端运行 (Front-running)",\n     "交易顺序可被矿工操纵",\n     "DEX 套利攻击"),\n    ("随机数不安全",\n     "链上随机数可被预测",\n     "多个博彩合约被攻击"),\n    ("Delegatecall 注入",\n     "不安全的 delegatecall 导致存储篡改",\n     "Parity 多签钱包事件（1.5 亿美元）"),\n]\n\nprint("=== 智能合约安全漏洞 Top 6 ===\\n")\nfor name, desc, example in vulnerabilities:\n    print(f"⚠️  {name}:")\n    print(f"   描述: {desc}")\n    print(f"   案例: {example}")\n    print()',
            expectedOutput: '=== 智能合约安全漏洞 Top 6 ===\n\n⚠️  重入攻击 (Reentrancy):\n    描述: 攻击者利用回调反复提取资金\n    案例: The DAO 事件（损失 6000 万美元）\n\n⚠️  整数溢出/下溢:\n    描述: 算术运算超出整数范围\n    案例: PoWHC 事件（4 亿美元）\n\n⚠️  访问控制缺失:\n    描述: 关键函数缺少权限检查\n    案例: Synthetix 事件（1 亿美元）\n\n⚠️  前端运行 (Front-running):\n    描述: 交易顺序可被矿工操纵\n    案例: DEX 套利攻击\n\n⚠️  随机数不安全:\n    描述: 链上随机数可被预测\n    案例: 多个博彩合约被攻击\n\n⚠️  Delegatecall 注入:\n    描述: 不安全的 delegatecall 导致存储篡改\n    案例: Parity 多签钱包事件（1.5 亿美元）',
            hint: '智能合约安全是 Web3 开发最重要的技能之一。智能合约不可篡改，部署后漏洞无法修复，损失无法追回。',
          }),
          createLesson({
            id: '3-21',
            courseId: 3,
            chapterId: 6,
            lessonNumber: 2,
            title: 'Checks-Effects-Interactions 模式',
            description: '学习防止重入攻击的经典编程模式',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-6-2.md',
            initialCode: '# Checks-Effects-Interactions 模式\n\nprint("=== CEI 模式 ===\\n")\n\nprint("安全提款函数写法（正确的顺序）:")\n\nsafe_code = """\ndef withdraw() public {\n    // 1. Checks（检查条件）\n    require(balances[msg.sender] > 0, \"余额不足\");\n    uint256 amount = balances[msg.sender];\n\n    // 2. Effects（更新状态）\n    balances[msg.sender] = 0;\n\n    // 3. Interactions（与外部交互）\n    (bool success, ) = msg.sender.call{value: amount}(\"\");\n    require(success, \"转账失败\");\n}\n"""  \n\nprint(safe_code)\n\nprint("关键: 先更新状态变量，再发送 ETH")\nprint("这样即使外部调用重入，余额已经是 0，不会重复提取")',
            expectedOutput: '=== CEI 模式 ===\n\n安全提款函数写法（正确的顺序）:\n\ndef withdraw() public {\n    // 1. Checks（检查条件）\n    require(balances[msg.sender] > 0, "余额不足");\n    uint256 amount = balances[msg.sender];\n\n    // 2. Effects（更新状态）\n    balances[msg.sender] = 0;\n\n    // 3. Interactions（与外部交互）\n    (bool success, ) = msg.sender.call{value: amount}(\"\");\n    require(success, "转账失败");\n}\n\n关键: 先更新状态变量，再发送 ETH\n这样即使外部调用重入，余额已经是 0，不会重复提取',
            hint: 'CEI 是防止重入攻击的黄金法则：先改状态，再发钱。此外还可以使用 OpenZeppelin 的 ReentrancyGuard 修饰器。',
          }),
          createLesson({
            id: '3-22',
            courseId: 3,
            chapterId: 6,
            lessonNumber: 3,
            title: '权限控制与修饰器',
            description: '学习使用修饰器实现函数权限控制',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-6-3.md',
            initialCode: '# 权限控制修饰器\n\nprint("=== Solidity 修饰器 (Modifier) ===\\n")\n\nmodifier_code = """\n// 仅 owner 可调用\nmodifier onlyOwner() {\n    require(msg.sender == owner, "Not the owner");\n    _;  // 占位符：执行被修饰的函数体\n}\n\n// 暂停状态检查\nmodifier whenNotPaused() {\n    require(!paused, "Contract is paused");\n    _;\n}\n\n// 可组合使用\nfunction criticalFunction() external onlyOwner whenNotPaused {\n    // 只有 owner 且合约未暂停时才能执行\n}\n"""\n\nprint(modifier_code)\n\nprint("常用权限模式:")\nprint("  onlyOwner — 仅合约所有者")\nprint("  onlyRole(role) — 仅特定角色")\nprint("  whenNotPaused — 合约暂停时禁止操作")\nprint("  nonReentrant — 防止重入（OpenZeppelin）")',
            expectedOutput: '=== Solidity 修饰器 (Modifier) ===\n\n// 仅 owner 可调用\nmodifier onlyOwner() {\n    require(msg.sender == owner, "Not the owner");\n    _;  // 占位符：执行被修饰的函数体\n}\n\n// 暂停状态检查\nmodifier whenNotPaused() {\n    require(!paused, "Contract is paused");\n    _;\n}\n\n// 可组合使用\nfunction criticalFunction() external onlyOwner whenNotPaused {\n    // 只有 owner 且合约未暂停时才能执行\n}\n\n常用权限模式:\n  onlyOwner — 仅合约所有者\n  onlyRole(role) — 仅特定角色\n  whenNotPaused — 合约暂停时禁止操作\n  nonReentrant — 防止重入（OpenZeppelin）',
            hint: '修饰器是 Solidity 中复用权限逻辑的最佳方式。OpenZeppelin 库提供了经过审计的 ReentrancyGuard、Ownable、AccessControl 等标准实现。',
          }),
          createLesson({
            id: '3-23',
            courseId: 3,
            chapterId: 6,
            lessonNumber: 4,
            title: '安全审计与最佳实践',
            description: '学习智能合约审计流程和开发最佳实践',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-6-4.md',
            initialCode: `# 智能合约安全最佳实践

print("=== 安全开发生命周期 ===\\n")

phases = [
    ("1. 设计阶段", "最小权限原则、形式化验证、威胁建模"),
    ("2. 开发阶段", "使用经过审计的库、遵循 CEI 模式、全面测试"),
    ("3. 审计阶段", "专业审计、自动化工具扫描、Bug Bounty"),
    ("4. 部署阶段", "多签部署、时间锁、渐进式升级"),
    ("5. 运维阶段", "监控异常、紧急暂停机制、定期审计"),
]

for phase, tasks in phases:
    print(f"{phase}:")
    print(f"  {tasks}")

print("\\n=== 推荐工具 ===")
tools = {
    "静态分析": ["Slither", "Mythril", "Aderyn"],
    "测试框架": ["Foundry", "Hardhat", "Brownie"],
    "形式化验证": ["Certora", "Echidna"],
    "审计平台": ["OpenZeppelin Defender", "Forta", "Tenderly"],
}

for category, items in tools.items():
    print(f"  {category}: {', '.join(items)}")`,
            expectedOutput: '=== 安全开发生命周期 ===\n\n1. 设计阶段: 最小权限原则、形式化验证、威胁建模\n2. 开发阶段: 使用经过审计的库、遵循 CEI 模式、全面测试\n3. 审计阶段: 专业审计、自动化工具扫描、Bug Bounty\n4. 部署阶段: 多签部署、时间锁、渐进式升级\n5. 运维阶段: 监控异常、紧急暂停机制、定期审计\n\n=== 推荐工具 ===\n  静态分析: Slither, Mythril, Aderyn\n  测试框架: Foundry, Hardhat, Brownie\n  形式化验证: Certora, Echidna\n  审计平台: OpenZeppelin Defender, Forta, Tenderly',
            hint: '智能合约安全是持续性的工作，不是一次性审计就能解决的。保持代码库最小化、使用标准库、建立应急响应机制。',
          }),
        ],
      }),

      // ---- 第 7 章：DeFi 协议开发（3 课时） ----
      createSubChapter({
        id: 7,
        title: 'DeFi 协议开发',
        icon: '💰',
        lessons: [
          createLesson({
            id: '3-24',
            courseId: 3,
            chapterId: 7,
            lessonNumber: 1,
            title: 'DeFi 核心概念',
            description: '理解去中心化金融的核心组件和运作模式',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-7-1.md',
            initialCode: '# DeFi 核心组件\n\nprint("=== DeFi 乐高积木 ===\\n")\n\ncomponents = {\n    "去中心化交易所 (DEX)": {\n        "function": "自动做市商 (AMM)",\n        "example": "Uniswap, Curve, Balancer",\n        "mechanism": "流动性池 + 恒定乘积公式 x*y=k",\n    },\n    "借贷协议": {\n        "function": "超额抵押借贷",\n        "example": "Aave, Compound, MakerDAO",\n        "mechanism": "资金池 + 利率模型 + 清算机制",\n    },\n    "稳定币": {\n        "function": "锚定法币价值的加密货币",\n        "example": "USDT, USDC, DAI",\n        "mechanism": "法币抵押 / 加密抵押 / 算法稳定",\n    },\n    "收益聚合器": {\n        "function": "自动优化收益策略",\n        "example": "Yearn Finance, Beefy",\n        "mechanism": "自动在多个协议间分配资产",\n    },\n}\n\nfor name, info in components.items():\n    print(f"{name}:")\n    print(f"  功能: {info[\'function\']}")\n    print(f"  案例: {info[\'example\']}")\n    print(f"  机制: {info[\'mechanism\']}")\n    print()',
            expectedOutput: '=== DeFi 乐高积木 ===\n\n去中心化交易所 (DEX):\n  功能: 自动做市商 (AMM)\n  案例: Uniswap, Curve, Balancer\n  机制: 流动性池 + 恒定乘积公式 x*y=k\n\n借贷协议:\n  功能: 超额抵押借贷\n  案例: Aave, Compound, MakerDAO\n  机制: 资金池 + 利率模型 + 清算机制\n\n稳定币:\n  功能: 锚定法币价值的加密货币\n  案例: USDT, USDC, DAI\n  机制: 法币抵押 / 加密抵押 / 算法稳定\n\n收益聚合器:\n  功能: 自动优化收益策略\n  案例: Yearn Finance, Beefy\n  机制: 自动在多个协议间分配资产',
            hint: 'DeFi 的核心是"可组合性"（Money Legos）：每个协议都是可复用的积木，可以像搭积木一样组合出复杂的金融产品。',
          }),
          createLesson({
            id: '3-25',
            courseId: 3,
            chapterId: 7,
            lessonNumber: 2,
            title: 'AMM 与流动性池',
            description: '理解自动做市商原理和流动性提供机制',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-7-2.md',
            initialCode: '# AMM (Automated Market Maker) 原理\n\nprint("=== 恒定乘积公式 x * y = k ===\\n")\n\nclass SimpleAMM:\n    def __init__(self, x_reserve, y_reserve):\n        self.x = x_reserve\n        self.y = y_reserve\n        self.k = x_reserve * y_reserve  # 恒定乘积\n\n    def get_price(self, x_in):\n        """计算用 x 换 y 的价格"""\n        new_x = self.x + x_in * 0.97  # 0.3% 手续费\n        new_y = self.k / new_x\n        y_out = self.y - new_y\n        return y_out\n\n    def add_liquidity(self, x, y):\n        self.x += x\n        self.y += y\n        self.k = self.x * self.y\n\n# 初始化: ETH/USDC 池\namm = SimpleAMM(x_reserve=100, y_reserve=200000)\n\nprint(f"初始: ETH={amm.x}, USDC={amm.y}, k={amm.k:.0f}")\n\n# 用 1 ETH 换 USDC\nusdc_out = amm.get_price(1)\nprint(f"\\n用 1 ETH 换得: {usdc_out:.2f} USDC")\nprint(f"兑换后: ETH={amm.x + 1 * 0.97:.2f}, USDC={amm.y - usdc_out:.2f}")\n\n# 添加流动性\namm.add_liquidity(10, 20000)\nprint(f"\\n添加流动性后: ETH={amm.x}, USDC={amm.y}, k={amm.k:.0f}")',
            expectedOutput: '=== 恒定乘积公式 x * y = k ===\n\n初始: ETH=100, USDC=200000, k=20000000\n\n用 1 ETH 换得: 1961.16 USDC\n兑换后: ETH=100.97, USDC=198038.84\n\n添加流动性后: ETH=110.97, USDC=218038.84, k=24181843.72',
            hint: 'AMM 的核心是 x*y=k。交易越多 → 价格滑点越大 → 大额交易成本高。流动性提供者 (LP) 赚取交易手续费。',
          }),
          createLesson({
            id: '3-26',
            courseId: 3,
            chapterId: 7,
            lessonNumber: 3,
            title: '闪电贷与套利',
            description: '了解闪电贷原理和 DeFi 套利策略',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-7-3.md',
            initialCode: '# 闪电贷 (Flash Loan) 原理\n\nprint("=== 闪电贷 ===\\n")\n\nprint("闪电贷特点:")\nprint("  1. 无抵押 — 不需要任何保证金")\nprint("  2. 同一笔交易内借还 — 原子性")\nprint("  3. 手续费 — 通常 0.09%（比普通贷款低 100x）")\nprint("  4. 失败即回滚 — 还不上的话整笔交易撤销")\n\nprint("\\n=== 闪电贷套利流程 ===")\nsteps = [\n    "1. 从 Aave 闪电借入 1000 ETH",\n    "2. 在 Uniswap (价格 $1800) 买入 ETH",\n    "3. 在 SushiSwap (价格 $1810) 卖出 ETH",\n    "4. 获利: 1000 × ($1810 - $1800) = $10,000",\n    "5. 偿还 Aave 贷款 + 手续费",\n    "6. 净赚约 $9,000（全部在同一个交易中完成）",\n]\n\nfor step in steps:\n    print(f"  {step}")\n\nprint("\\n注意: 闪电贷也是攻击者的常用工具")\nprint("如 Cream Finance、bZx 等都曾遭闪电贷攻击")',
            expectedOutput: '=== 闪电贷 ===\n\n闪电贷特点:\n  1. 无抵押 — 不需要任何保证金\n  2. 同一笔交易内借还 — 原子性\n  3. 手续费 — 通常 0.09%（比普通贷款低 100x）\n  4. 失败即回滚 — 还不上的话整笔交易撤销\n\n=== 闪电贷套利流程 ===\n  1. 从 Aave 闪电借入 1000 ETH\n  2. 在 Uniswap (价格 $1800) 买入 ETH\n  3. 在 SushiSwap (价格 $1810) 卖出 ETH\n  4. 获利: 1000 × ($1810 - $1800) = $10,000\n  5. 偿还 Aave 贷款 + 手续费\n  6. 净赚约 $9,000（全部在同一个交易中完成）\n\n注意: 闪电贷也是攻击者的常用工具\n如 Cream Finance、bZx 等都曾遭闪电贷攻击',
            hint: '闪电贷是 DeFi 的创新，但被用于套利、清算和攻击。所有操作都在同一笔交易中完成（原子性），失败则全部回滚。',
          }),
        ],
      }),

      // ---- 第 8 章：DApp 开发（3 课时） ----
      createSubChapter({
        id: 8,
        title: 'DApp 开发实战',
        icon: '🔨',
        lessons: [
          createLesson({
            id: '3-27',
            courseId: 3,
            chapterId: 8,
            lessonNumber: 1,
            title: 'Web3.js 与 Ethers.js',
            description: '学习前端与区块链交互的 JavaScript 库',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-8-1.md',
            initialCode: '# 前端与以太坊交互（Ethers.js 示例）\n\nprint("=== Ethers.js 核心操作 ===\\n")\n\noperations = """\n// 1. 连接钱包\nconst provider = new ethers.BrowserProvider(window.ethereum);\nconst signer = await provider.getSigner();\n\n// 2. 查询余额\nconst balance = await provider.getBalance(address);\nconsole.log(ethers.formatEther(balance), "ETH");\n\n// 3. 发送交易\nconst tx = await signer.sendTransaction({\n    to: "0x recipient",\n    value: ethers.parseEther("1.0")\n});\nawait tx.wait(); // 等待确认\n\n// 4. 调用智能合约\nconst contract = new ethers.Contract(address, abi, signer);\nawait contract.transfer(recipient, amount);\n"""\n\nprint(operations)\n\nprint("常见库:")\nprint("  Ethers.js v6 — 推荐，模块化，TypeScript 支持好")\nprint("  Web3.js — 老牌库，功能全面")\nprint("  Viem — 新锐，轻量高性能")',
            expectedOutput: '=== Ethers.js 核心操作 ===\n\n// 1. 连接钱包\nconst provider = new ethers.BrowserProvider(window.ethereum);\nconst signer = await provider.getSigner();\n\n// 2. 查询余额\nconst balance = await provider.getBalance(address);\nconsole.log(ethers.formatEther(balance), "ETH");\n\n// 3. 发送交易\nconst tx = await signer.sendTransaction({\n    to: "0x recipient",\n    value: ethers.parseEther("1.0")\n});\nawait tx.wait(); // 等待确认\n\n// 4. 调用智能合约\nconst contract = new ethers.Contract(address, abi, signer);\nawait contract.transfer(recipient, amount);\n\n常见库:\n  Ethers.js v6 — 推荐，模块化，TypeScript 支持好\n  Web3.js — 老牌库，功能全面\n  Viem — 新锐，轻量高性能',
            hint: 'Ethers.js 是目前最流行的以太坊交互库，v6 版本 API 有较大变化。推荐使用 TypeScript 开发以获得更好的类型提示。',
          }),
          createLesson({
            id: '3-28',
            courseId: 3,
            chapterId: 8,
            lessonNumber: 2,
            title: '去中心化存储 (IPFS)',
            description: '学习 IPFS 原理和将 DApp 数据存储在分布式网络中',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-8-2.md',
            initialCode: '# IPFS (InterPlanetary File System) 原理\n\nprint("=== IPFS 核心概念 ===\\n")\n\nprint("传统 HTTP:")\nprint("  地址 = 服务器的位置 (IP + 路径)")\nprint("  问题: 中心化、单点故障、内容易篡改")\n\nprint("\\nIPFS:")\nprint("  地址 = 内容的哈希 (CID)")\nprint("  优点: 去中心化、内容寻址、不可篡改")\n\nprint("\\n=== IPFS 工作流程 ===")\nsteps = [\n    "1. 文件添加到 IPFS 网络",\n    "2. 系统计算文件 CID (Content Identifier)",\n    "3. 文件分片存储在网络节点上",\n    "4. 通过 CID 可从任何节点获取",\n    "5. CID 校验确保内容未被篡改",\n]\n\nfor step in steps:\n    print(f"  {step}")\n\nprint("\\n=== IPFS 在 DApp 中的应用 ===")\nprint("  - NFT 元数据存储")\nprint("  - DApp 前端静态资源托管")\nprint("  - 去中心化网页 (IPNS + DNSLink)")\nprint("  - 大型文件存储（与 Filecoin 结合）")',
            expectedOutput: '=== IPFS 核心概念 ===\n\n传统 HTTP:\n  地址 = 服务器的位置 (IP + 路径)\n  问题: 中心化、单点故障、内容易篡改\n\nIPFS:\n  地址 = 内容的哈希 (CID)\n  优点: 去中心化、内容寻址、不可篡改\n\n=== IPFS 工作流程 ===\n  1. 文件添加到 IPFS 网络\n  2. 系统计算文件 CID (Content Identifier)\n  3. 文件分片存储在网络节点上\n  4. 通过 CID 可从任何节点获取\n  5. CID 校验确保内容未被篡改\n\n=== IPFS 在 DApp 中的应用 ===\n  - NFT 元数据存储\n  - DApp 前端静态资源托管\n  - 去中心化网页 (IPNS + DNSLink)\n  - 大型文件存储（与 Filecoin 结合）',
            hint: 'IPFS 不等于完全永久存储。文件需要至少有一个节点"pin"（固定）才不会消失。Filecoin 是 IPFS 上的激励层存储市场。',
          }),
          createLesson({
            id: '3-29',
            courseId: 3,
            chapterId: 8,
            lessonNumber: 3,
            title: '全栈 DApp 架构',
            description: '了解完整的 DApp 技术栈和架构设计',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-8-3.md',
            initialCode: '# DApp 全栈技术栈\n\nprint("=== 典型 DApp 架构 ===\\n")\n\nstack = {\n    "前端层": {\n        "框架": "React / Next.js / Vue",\n        "Web3 库": "Ethers.js / Wagmi / RainbowKit",\n        "组件库": "Web3-React / Web3Modal",\n    },\n    "合约层": {\n        "语言": "Solidity / Vyper",\n        "框架": "Hardhat / Foundry / Truffle",\n        "测试": "Foundry / Waffle / Chai",\n        "审计": "Slither / Mythril / Certora",\n    },\n    "链下层": {\n        "索引": "The Graph (子图)",\n        "存储": "IPFS / Arweave",\n        "计算": "Chainlink / Gelato",\n    },\n    "基础设施": {\n        "节点": "Infura / Alchemy / QuickNode",\n        "监控": "Tenderly / OpenZeppelin Defender",\n        "部署": "Vercel / Fleek / IPFS",\n    },\n}\n\nfor layer, services in stack.items():\n    print(f"{layer}:")\n    for name, tech in services.items():\n        print(f"  {name}: {tech}")\n    print()',
            expectedOutput: '=== 典型 DApp 架构 ===\n\n前端层:\n  框架: React / Next.js / Vue\n  Web3 库: Ethers.js / Wagmi / RainbowKit\n  组件库: Web3-React / Web3Modal\n\n合约层:\n  语言: Solidity / Vyper\n  框架: Hardhat / Foundry / Truffle\n  测试: Foundry / Waffle / Chai\n  审计: Slither / Mythril / Certora\n\n链下层:\n  索引: The Graph (子图)\n  存储: IPFS / Arweave\n  计算: Chainlink / Gelato\n\n基础设施:\n  节点: Infura / Alchemy / QuickNode\n  监控: Tenderly / OpenZeppelin Defender\n  部署: Vercel / Fleek / IPFS',
            hint: 'DApp 开发是全栈工程：前端需要处理钱包连接、交易签名、状态监听；后端需要智能合约编写、测试、部署和监控。',
          }),
        ],
      }),

      // ---- 第 9 章：NFT 与数字资产（3 课时） ----
      createSubChapter({
        id: 9,
        title: 'NFT 与数字资产',
        icon: '🖼️',
        lessons: [
          createLesson({
            id: '3-30',
            courseId: 3,
            chapterId: 9,
            lessonNumber: 1,
            title: 'NFT 标准与元数据',
            description: '深入 ERC-721 标准和 NFT 元数据设计',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-9-1.md',
            initialCode: '# NFT 核心概念\n\nprint("=== NFT (Non-Fungible Token) ===\\n")\n\nprint("NFT 三要素:")\nprint("  1. 唯一性 — 每个 NFT 有唯一的 tokenId")\nprint("  2. 所有权 — 链上记录不可篡改")\nprint("  3. 可验证 — 任何人都可验证真实性和所有者")\n\nprint("\\n=== ERC-721 核心接口 ===")\ninterface_methods = [\n    ("balanceOf(address)", "查询地址持有 NFT 数量"),\n    ("ownerOf(uint256)", "查询 tokenId 的所有者"),\n    ("safeTransferFrom(...)", "安全转移 NFT"),\n    ("approve(...)", "授权他人转移"),\n    ("tokenURI(uint256)", "获取元数据 URL"),\n]\n\nfor method, desc in interface_methods:\n    print(f"  {method}: {desc}")\n\nprint("\\n=== 元数据标准 (ERC-721 Metadata) ===")\nprint(\'{"name": "Bored Ape #1234",\')\nprint(\' "description": "...",\')\nprint(\' "image": "ipfs://Qm...",\')\nprint(\' "attributes": [{"trait_type": "Fur", "value": "Blue"}]}\')',
            expectedOutput: '=== NFT (Non-Fungible Token) ===\n\nNFT 三要素:\n  1. 唯一性 — 每个 NFT 有唯一的 tokenId\n  2. 所有权 — 链上记录不可篡改\n  3. 可验证 — 任何人都可验证真实性和所有者\n\n=== ERC-721 核心接口 ===\n  balanceOf(address): 查询地址持有 NFT 数量\n  ownerOf(uint256): 查询 tokenId 的所有者\n  safeTransferFrom(...): 安全转移 NFT\n  approve(...): 授权他人转移\n  tokenURI(uint256): 获取元数据 URL\n\n=== 元数据标准 (ERC-721 Metadata) ===\n{"name": "Bored Ape #1234",\n "description": "...",\n "image": "ipfs://Qm...",\n "attributes": [{"trait_type": "Fur", "value": "Blue"}]}',
            hint: 'ERC-721 是不可替代代币标准。每个 tokenId 唯一，适合数字艺术品、收藏品、游戏道具、域名等场景。',
          }),
          createLesson({
            id: '3-31',
            courseId: 3,
            chapterId: 9,
            lessonNumber: 2,
            title: 'NFT 智能合约开发',
            description: '编写符合 ERC-721 标准的 NFT 智能合约',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-9-2.md',
            initialCode: '# ERC-721 NFT 合约（简化版）\n\nprint("=== NFT 合约核心逻辑 ===\\n")\n\ncontract_code = """\nimport \"@openzeppelin/contracts/token/ERC721/ERC721.sol\";\nimport \"@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol\";\n\ncontract MyNFT is ERC721, ERC721URIStorage {\n    uint256 private _tokenIdCounter;\n    uint256 public maxSupply;\n    uint256 public mintPrice;\n\n    constructor()\n        ERC721(\"MyNFT\", \"MNFT\")\n    {\n        maxSupply = 10000;\n        mintPrice = 0.05 ether;\n        _tokenIdCounter = 0;\n    }\n\n    function mint() external payable {\n        require(_tokenIdCounter < maxSupply, \"Sold out\");\n        require(msg.value >= mintPrice, \"Insufficient funds\");\n\n        uint256 tokenId = _tokenIdCounter++;\n        _safeMint(msg.sender, tokenId);\n        _setTokenURI(tokenId, generateTokenURI(tokenId));\n    }\n\n    function generateTokenURI(uint256 tokenId)\n        internal\n        pure\n        returns (string memory)\n    {\n        // 返回 JSON 元数据的 IPFS 链接\n        return string(abi.encodePacked(\n            \"ipfs://Qm...\", Strings.toString(tokenId), \".json\"\n        ));\n    }\n}\n"""\n\nprint(contract_code)\nprint("\\n使用 OpenZeppelin 合约库可以大大减少安全风险")',
            expectedOutput: '=== NFT 合约核心逻辑 ===\n\nimport "@openzeppelin/contracts/token/ERC721/ERC721.sol";\nimport "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";\n\ncontract MyNFT is ERC721, ERC721URIStorage {\n    uint256 private _tokenIdCounter;\n    uint256 public maxSupply;\n    uint256 public mintPrice;\n\n    constructor()\n        ERC721("MyNFT", "MNFT")\n    {\n        maxSupply = 10000;\n        mintPrice = 0.05 ether;\n        _tokenIdCounter = 0;\n    }\n\n    function mint() external payable {\n        require(_tokenIdCounter < maxSupply, "Sold out");\n        require(msg.value >= mintPrice, "Insufficient funds");\n\n        uint256 tokenId = _tokenIdCounter++;\n        _safeMint(msg.sender, tokenId);\n        _setTokenURI(tokenId, generateTokenURI(tokenId));\n    }\n}\n\n使用 OpenZeppelin 合约库可以大大减少安全风险',
            hint: 'OpenZeppelin Contracts 是经过审计的 Solidity 库，是行业标准。永远不要自己实现 ERC-721，使用 OpenZeppelin 的 ERC721 合约。',
          }),
          createLesson({
            id: '3-32',
            courseId: 3,
            chapterId: 9,
            lessonNumber: 3,
            title: 'NFT 市场与版税',
            description: '了解 NFT 交易市场和版税机制的设计',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-9-3.md',
            initialCode: '# NFT 市场与版税机制\n\nprint("=== NFT 交易市场 ===\\n")\n\nmarketplaces = {\n    "OpenSea": {"type": "链下撮合", "fee": "2.5%", "chain": "多链"},\n    "Blur": {"type": "链上竞价", "fee": "0.5%", "chain": "以太坊, Blur"},\n    "LooksRare": {"type": "社区驱动", "fee": "1.5%", "chain": "以太坊"},\n    "Magic Eden": {"type": "专业平台", "fee": "2%", "chain": "Solana, 以太坊"},\n}\n\nprint("主要 NFT 市场:")\nfor name, info in marketplaces.items():\n    print(f"  {name}: 手续费 {info[\'fee\']}, 模式: {info[\'type\']}")\n\nprint("\\n=== EIP-2981 版税标准 ===")\nprint("接口: royaltyInfo(tokenId, salePrice) → (receiver, royaltyAmount)")\nprint("\\n版税计算:")\nprice = 100  # ETH\nroyalty_bps = 500  # 5%\nroyalty = price * royalty_bps / 10000\ncreator = price - royalty\nprint(f"  售价: {price} ETH")\nprint(f"  版税 (5%): {royalty} ETH")\nprint(f"  创作者收入: {creator} ETH")',
            expectedOutput: '=== NFT 交易市场 ===\n\n主要 NFT 市场:\n  OpenSea: 手续费 2.5%, 模式: 链下撮合\n  Blur: 手续费 0.5%, 模式: 链上竞价\n  LooksRare: 手续费 1.5%, 模式: 社区驱动\n  Magic Eden: 手续费 2%, 模式: 专业平台\n\n=== EIP-2981 版税标准 ===\n接口: royaltyInfo(tokenId, salePrice) → (receiver, royaltyAmount)\n\n版税计算:\n  售价: 100 ETH\n  版税 (5%): 5.0 ETH\n  创作者收入: 95.0 ETH',
            hint: 'EIP-2981 是 NFT 版税的通用标准，让市场在每次转售时自动计算并支付版税给创作者。但市场是否遵守是自愿的。',
          }),
        ],
      }),

      // ---- 第 10 章：Layer 2 与扩容方案（3 课时） ----
      createSubChapter({
        id: 10,
        title: 'Layer 2 与扩容方案',
        icon: '📈',
        lessons: [
          createLesson({
            id: '3-33',
            courseId: 3,
            chapterId: 10,
            lessonNumber: 1,
            title: '区块链扩容问题',
            description: '理解区块链不可能三角和扩容的必要性',
            difficulty: 'medium',
            duration: 15,
            contentPath: '/src/lib/content/lessons/blockchain/3-10-1.md',
            initialCode: '# 区块链不可能三角 (Blockchain Trilemma)\n\nprint("=== 区块链不可能三角 ===\\n")\n\nprint("三个目标，最多同时满足两个:")\nprint("  1. 去中心化 (Decentralization)")\nprint("  2. 可扩展性 (Scalability)")\nprint("  3. 安全性 (Security)")\n\nprint("\\n=== 各链的取舍 ===")\ntradeoffs = [\n    ("Bitcoin", "安全+去中心化 → 牺牲可扩展性 (7 TPS)"),\n    ("Ethereum L1", "安全+去中心化 → 牺牲可扩展性 (~15 TPS)"),\n    ("Solana", "安全+可扩展性 → 牺牲去中心化 (高节点要求)"),\n    ("BSC", "可扩展性+去中心化 → 牺牲安全性 (21 验证节点)"),\n]\n\nfor chain, tradeoff in tradeoffs:\n    print(f"  {chain}: {tradeoff}")\n\nprint("\\n=== 扩容方案分类 ===")\nprint("  Layer 1（链上扩容）: 改变区块链基础协议")\nprint("  Layer 2（链下扩容）: 在主链之上构建二层网络")\nprint("  分片 (Sharding): 将链分成多个并行分片")',
            expectedOutput: '=== 区块链不可能三角 ===\n\n三个目标，最多同时满足两个:\n  1. 去中心化 (Decentralization)\n  2. 可扩展性 (Scalability)\n  3. 安全性 (Security)\n\n=== 各链的取舍 ===\n  Bitcoin: 安全+去中心化 → 牺牲可扩展性 (7 TPS)\n  Ethereum L1: 安全+去中心化 → 牺牲可扩展性 (~15 TPS)\n  Solana: 安全+可扩展性 → 牺牲去中心化 (高节点要求)\n  BSC: 可扩展性+去中心化 → 牺牲安全性 (21 验证节点)\n\n=== 扩容方案分类 ===\n  Layer 1（链上扩容）: 改变区块链基础协议\n  Layer 2（链下扩容）: 在主链之上构建二层网络\n  分片 (Sharding): 将链分成多个并行分片',
            hint: '区块链不可能三角由 Vitalik Buterin 提出。Layer 2 是目前以太坊社区最主要的扩容路径。',
          }),
          createLesson({
            id: '3-34',
            courseId: 3,
            chapterId: 10,
            lessonNumber: 2,
            title: 'Rollups：Optimistic vs ZK',
            description: '深入理解两种主流 Layer 2 技术路线',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-10-2.md',
            initialCode: '# Layer 2 Rollup 对比\n\nprint("=== Rollup 技术路线对比 ===\\n")\n\nrollups = {\n    "Optimistic Rollup": {\n        "原理": "假设交易有效，7 天挑战期",\n        "证明": "欺诈证明 (Fraud Proof)",\n        "兼容性": "完全 EVM 兼容",\n        "项目": "Arbitrum, Optimism",\n        "TPS": "~2000",\n        "安全模型": "1/N 诚实假设",\n    },\n    "ZK Rollup": {\n        "原理": "每批交易生成有效性证明",\n        "证明": "零知识证明 (ZK-SNARK/STARK)",\n        "兼容性": "有限 EVM 兼容",\n        "项目": "zkSync, StarkNet, Polygon zkEVM, Scroll",\n        "TPS": "~2000+",\n        "安全模型": "数学保证（无需信任假设）",\n    },\n}\n\nfor name, info in rollups.items():\n    print(f"{name}:")\n    for k, v in info.items():\n        print(f"  {k}: {v}")\n    print()',
            expectedOutput: '=== Rollup 技术路线对比 ===\n\nOptimistic Rollup:\n  原理: 假设交易有效，7 天挑战期\n  证明: 欺诈证明 (Fraud Proof)\n  兼容性: 完全 EVM 兼容\n  项目: Arbitrum, Optimism\n  TPS: ~2000\n  安全模型: 1/N 诚实假设\n\nZK Rollup:\n  原理: 每批交易生成有效性证明\n  证明: 零知识证明 (ZK-SNARK/STARK)\n  兼容性: 有限 EVM 兼容\n  项目: zkSync, StarkNet, Polygon zkEVM, Scroll\n  TPS: ~2000+\n  安全模型: 数学保证（无需信任假设）',
            hint: 'Optimistic Rollup 优点是 EVM 兼容性好，缺点是提款需等待 7 天。ZK Rollup 优点是即时最终性和更高安全保证，缺点是生成证明成本高。',
          }),
          createLesson({
            id: '3-35',
            courseId: 3,
            chapterId: 10,
            lessonNumber: 3,
            title: '跨链桥与互操作',
            description: '理解跨链桥原理和区块链互操作方案',
            difficulty: 'hard',
            duration: 20,
            contentPath: '/src/lib/content/lessons/blockchain/3-10-3.md',
            initialCode: '# 跨链桥与互操作\n\nprint("=== 跨链桥类型 ===\\n")\n\nbridge_types = {\n    "锁定-铸造 (Lock & Mint)": {\n        "流程": "锁定 L1 资产 → L2 铸造等量映射资产",\n        "赎回": "销毁 L2 映射资产 → L1 解锁原始资产",\n        "风险": "L1 锁仓合约被攻击",\n        "案例": "Polygon PoS Bridge",\n    },\n    "轻客户端桥": {\n        "流程": "L2 维护 L1 轻客户端验证状态",\n        "赎回": "无需信任第三方，数学验证",\n        "风险": "验证逻辑复杂，开发难度大",\n        "案例": "Cosmos IBC, Bitcoin SPV",\n    },\n    "原子交换 (Atomic Swap)": {\n        "流程": "哈希时间锁 (HTLC) 实现跨链交换",\n        "赎回": "双方在时限内提供正确哈希原像",\n        "风险": "流动性分散，用户体验差",\n        "案例": "闪电网络, THORChain",\n    },\n}\n\nfor name, info in bridge_types.items():\n    print(f"{name}:")\n    for k, v in info.items():\n        print(f"  {k}: {v}")\n    print()\n\nprint("⚠️ 跨链桥安全警告:")\nprint("跨链桥是区块链领域最受攻击的目标")\nprint("Ronin ($625M), Wormhole ($320M), Poly Network ($610M)")',
            expectedOutput: '=== 跨链桥类型 ===\n\n锁定-铸造 (Lock & Mint):\n  流程: 锁定 L1 资产 → L2 铸造等量映射资产\n  赎回: 销毁 L2 映射资产 → L1 解锁原始资产\n  风险: L1 锁仓合约被攻击\n  案例: Polygon PoS Bridge\n\n轻客户端桥:\n  流程: L2 维护 L1 轻客户端验证状态\n  赎回: 无需信任第三方，数学验证\n  风险: 验证逻辑复杂，开发难度大\n  案例: Cosmos IBC, Bitcoin SPV\n\n原子交换 (Atomic Swap):\n  流程: 哈希时间锁 (HTLC) 实现跨链交换\n  赎回: 双方在时限内提供正确哈希原像\n  风险: 流动性分散，用户体验差\n  案例: 闪电网络, THORChain\n\n⚠️ 跨链桥安全警告:\n跨链桥是区块链领域最受攻击的目标\nRonin ($625M), Wormhole ($320M), Poly Network ($610M)',
            hint: '跨链桥是 DeFi 的安全瓶颈。截至 2024 年，跨链桥攻击造成的损失超过 $25 亿。设计跨链桥时安全是第一优先级。',
          }),
        ],
      }),
    ],
  },
];

// ========== 工具函数 ==========

/**
 * 根据课程 ID 获取课程数据
 */
export function getCourseById(courseId: number): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

/**
 * 根据课程 ID 和子章节 ID 获取子章节数据
 */
export function getChapterByCourseAndId(courseId: number, chapterId: number): SubChapter | undefined {
  const course = getCourseById(courseId);
  return course?.chapters.find((ch) => ch.id === chapterId);
}

/**
 * 根据课程 ID 和课时 ID 获取课时数据
 */
export function getLessonByCourseChapterAndId(
  courseId: number,
  chapterId: number,
  lessonId: string
): Lesson | undefined {
  const chapter = getChapterByCourseAndId(courseId, chapterId);
  return chapter?.lessons.find((l) => l.id === lessonId);
}

/**
 * 根据课时 ID 获取课时数据（兼容旧接口）
 */
export function getLessonById(lessonId: string): Lesson | undefined {
  for (const course of courses) {
    for (const chapter of course.chapters) {
      const lesson = chapter.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
}

/**
 * 获取所有课时列表（扁平化）
 */
export function getAllLessons(): Lesson[] {
  return courses.flatMap((c) => c.chapters.flatMap((ch) => ch.lessons));
}
