---
title: "VBA"
description: ""
date: 2020-11-07
lastmod: 2020-11-07
tags: ["VBA"]
categories: ["🛠工具"]
author: "lei"
draft: false
---

# VBA

## 操作工作表

### 新建表

```vb
sub 新建()
    Sheets.add after:=sheets(sheets.count)
    sheets(sheets.count).name="工作表" '工作表命名'
end sub
```

### 根据模板生成

```vb
Sub 生成()
Application.DisplayAlerts = False

Dim i As Integer
For i = 1 To InputBox("生成工作表个数")
    Worksheets(1).Copy after:=Worksheets(Worksheets.Count)
    Worksheets(Worksheets.Count).Name = "12月" & i & "日"
    Worksheets(Worksheets.Count).Range("A1") = "12月" & i & "日"
Next
Worksheets(1).Select
Application.DisplayAlerts = True
End Sub
```

### 删除所有工作表

```vb
Sub 清除()
Application.DisplayAlerts = False
Do While Worksheets.Count <> 1
    Worksheets(Worksheets.Count).Delete
Loop
Application.DisplayAlerts = True
End Sub
```

### 根据工作表生成目录

```vb
Sub CreateMenu()
Sheets.Add(Before:=Sheets(1)).Name = "目录"  '新建一个目录工作表
Worksheets("目录").Activate
    For i = 2 To Sheets.Count
        If Sheets(i).Visible = True Then
            Cells(i, 1) = Sheets(i).Name  '将其他工作表名称分别填入单元格中
            Cells(i, 1).Select
                ActiveSheet.Hyperlinks.Add Anchor:=Selection, Address:="", SubAddress:="'" & Sheets(i).Name & "'!A1", TextToDisplay:=Cells(i, 1).Value
                '创建超链接
        End If
    Next i
End Sub
```

## 操作工作簿

### 所有工作表另存工作簿

```vb
Sub 拆分()
Application.ScreenUpdating = False
Dim sht As Worksheet
For Each sht In Worksheets
    sht.Copy
    ActiveWorkbook.SaveAs Filename:="C:\Users\lei\Desktop\T\" & sht.Name & ".xlsx"
    ActiveWorkbook.Close
Next
Application.ScreenUpdating = True
End Sub
```

## 操作单元格

### 常见代码

```vb
[a10]  		'a10单元格，不支持变量'
cells(2,3) 	'第二行第三列，只能选择一个格子，支持变量'
range("a10")	'a10单元格，应用场景广泛'
range("a10").value	'单元格默认属性为 .value，大多情况可以省略'

range("a1").offset(10,0) '下移10行，右移0列'
range("a1000").end(xlUP).Row	'表示a1000单元格往上第一个有数据的格子的行号，.Row返回单元格行号'

range("a10").EntireRow	'a10 单元格所在的整行'
range("a10").resize(1,4)  '重新选择a10单元格区域大小'

range("a10:f10").copy range("a11")		'将a10:f10区域，复制到a11'

range("a10:f10").Merge	'将a10:f10区域合并'
```

### 数据拆分到多表（循环）

```vb
Sub 拆分()
    '工作表建好了情况下，固定列，该段代码仅供参考，通过循环'
Dim i, j, k As Integer
Call 清空   '调用 清空 这个过程
For j = 2 To Sheets.Count
    For i = 2 To Sheets(1).Range("a10000").End(xlUp).Row
        If Sheets(1).Range("d" & i) = Sheets(j).Name Then
            k = Sheets(j).Range("a10000").End(xlUp).Row
            Sheets(1).Range("d" & i).EntireRow.Copy Sheets(j).Range("a" & k + 1)
        End If
    Next
Next
End Sub

Sub 清空()
    For i = 2 To Sheets.Count
        Sheets(i).Range("a2:f1000").ClearContents
    Next
End Sub
```

### 数据拆分到多表（筛选）

```vb
Sub 拆分()
    '工作表建好了情况下，固定列，效率比for循环高很多
    Dim i As Integer
    Call 清空
    For i = 2 To Sheets.Count
        Sheets(1).Range("A1:F1048").AutoFilter Field:=4, Criteria1:=Sheets(i).Name
        Sheets(1).Range("A1:F1048").Copy Sheets(i).Range("a2")
    Next
    Sheets(1).Range("A1:F1048").AutoFilter  '''取消筛选
End Sub
Sub 清空()
        For i = 2 To Sheets.Count
            Sheets(i).Range("a2:f1000").ClearContents
        Next
End Sub
```

### 数据根据某列拆分建表

```vb
Sub 根据某列建表并复制数据()
'重点 
'1.新建表避免表名重复
'2.通过用户输入 根据哪列进行拆分
'3.通过筛选将相应的数据拷贝到对应工作表
Application.DisplayAlerts = False
Dim sht As Worksheet
Dim i, irow, j, k As Integer
Dim a As Range
Dim l As Integer '按哪列拆分
l = InputBox("请输入按哪列拆分（输入数字）")
irow = Sheets(1).Range("a10000").End(xlUp).Row '数据行

'删除多余工作表
For j = 2 To Sheets.Count
    Sheets(Sheets.Count).DrawingObjects.Delete
Next

'根据列拆分表
For i = 2 To irow
    k = 0
    Set a = Worksheets(1).Cells(i, l)
    For Each sht In Sheets
        If sht.Name = a Then
            k = 1
        End If
    Next
    If k = 0 Then
        Sheets.Add after:=Sheets(Sheets.Count)
        Sheets(Sheets.Count).Name = a.Value
    End If
Next

'通过筛选复制数据
For j = 2 To Sheets.Count
    Sheets(1).Range("a1:f" & irow).AutoFilter field:=l, Criteria1:=Sheets(j).Name   'field:=l 筛选哪一列(这里是变量 l)
    Sheets(1).Range("a1:f" & irow).Copy Sheets(j).Range("a2")
Next
Sheets(1).Range("a1:f" & irow).AutoFilter
Sheets(1).Select
Application.DisplayAlerts = True	
End Sub
```
### 合并多个工作表

```vb
Sub 合并多表()
Dim sht As Worksheet
Dim i, j As Integer
For Each sht In Sheets
    i = Sheets(1).Range("a10000").End(xlUp).Row
    j = sht.Range("a10000").End(xlUp).Row
    If sht.Name <> Sheets(1).Name Then
        sht.Range("a2:f" & j).Copy Sheets(1).Range("a" & i + 1) '最后数据行下面粘贴
    End If
Next
End Sub
```

### 单元格格式

```vb
'字体格式选项卡'
With Selection.Font
    .Name = "华文琥珀"		'字体'
    .Size = 9		'字号'
    .Strikethrough = False		'删除线'
    .Superscript = False		'上标'
    .Subscript = False		'下标'
    .OutlineFont = False		'大纲字体'
    .Shadow = False		'阴影'
    .Underline = xlUnderlineStyleNone		'下划线'
    .ColorIndex = xlAutomatic		'字体颜色'
    .TintAndShade = 0		'字体颜色变深或变浅'
    .ThemeFont = xlThemeFontNone		'主题字体'
End With

'填充色选项卡'
 With Selection.Interior
    .Pattern = xlSolid		'图案样式'
    .PatternColorIndex = xlAutomatic	'图案颜色'
    .ThemeColor = xlThemeColorDark1		'主题颜色'
    .TintAndShade = 0		'颜色变深或变浅'
    .Color = 65535		'填充色'
    .PatternTintAndShade = 0		'对象的单色和底纹图案'
End With
```

### 工作表事件案例1

```vb
'标亮选中行，工作表事件，当选取发生变化自动执行以下代码'
Private Sub Worksheet_SelectionChange(ByVal Target As Range)	'选区变换执行'
    Cells.Interior.Pattern = xlNone
    With Selection.EntireRow.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 65535
    End With
End Sub
```

### 工作表事件案例2

```vb
'通过单元格内容筛选某列，并自动更新'
Private Sub Worksheet_Change(ByVal Target As Range)	'工作表内容变化执行'
    Application.EnableEvents = False    '关闭事件响应，否则此段代码会卡死
    Dim i, j As Integer
    i = ActiveSheet.Range("a10000").End(xlUp).Row    '数据行数量
    j = ActiveSheet.Range("l10000").End(xlUp).Row   '筛选出来的数据行数量
    ActiveSheet.Range("l1:q" & j).ClearContents     '清除筛选出来的数据
    ActiveSheet.Range("A1:F" & i).AutoFilter Field:=4, Criteria1:=Range("i2")
    ActiveSheet.Range("A1:F" & i).Copy ActiveSheet.Range("l1")
    ActiveSheet.Range("A1:F" & i).AutoFilter
    Application.EnableEvents = True
End Sub
```

### 工作簿事件案例1

```vb
'工作簿保存时备份文件'
Private Sub Workbook_BeforeSave(ByVal SaveAsUI As Boolean, Cancel As Boolean)	'工作簿保存前触发事件'
    Dim dateTime As String
    dateTime = Format(Now(), "mmddhhmmss")  '获取当前时间
    '保存工作簿时 新建一份副本
    ThisWorkbook.SaveCopyAs Filename:="G:\code\vba\跟着王佩丰学VBA附件\VBA07\backup\" & dateTime & ".xlsx"
End Sub
```

### 工作簿事件案例2

```vb
'制作密码验证表，输入对应的密码显示对应的工作表'
Private Sub Workbook_BeforeClose(Cancel As Boolean)	'工作簿关闭之前执行'
'隐藏除了登录以外的表'
Dim sht As Worksheet
For Each sht In Sheets
    If sht.Name <> "登录" Then
            sht.Visible = xlSheetVeryHidden '隐藏除登录外所有工作表
    End If
Next
ActiveWorkbook.Save '保存活动工作簿
End Sub

Private Sub Workbook_Open() 	'工作簿打开时执行事件
Dim i As String
Dim sht As Worksheet
i = InputBox("请输入密码")
If "123" = i Then
    For Each sht In Sheets
        If InStr(sht.Name, "张三") <> 0 Then    '工作表名包含张三时
            sht.Visible = xlSheetVisible    '显示工作表
        End If
    Next
ElseIf "456" = i Then
    For Each sht In Sheets
        If InStr(sht.Name, "李四") <> 0 Then
            sht.Visible = xlSheetVisible
        End If
    Next
Else
    MsgBox ("密码错误")
    ActiveWorkbook.Close Savechanges:=True '不保存关闭工作簿
End If
End Sub
```

## 工作表函数

### 介绍

```vbscript
'Countif  Vlookup这些函数在VBA里调用：Application.WorksheetFunction
Instr() '函数可返回一个字符串在另一个字符串中首次出现的位置'
Split() '用于将特定字符分开'
On Error Resume Next '跳过错误语句'
IsNumeric()	'返回 Boolean 值，返回变量是否为一个数值'
Val()	'文本转化为数值'

```

|             |          |
| ----------- | -------- |
| Strings     | 文本函数 |
| Math        | 数学函数 |
| Datetime    | 日期时间 |
| FileSystem  | 文件信息 |
| Financial   | 财务函数 |
| Information | 信息函数 |
| Interaction | 交互函数 |

### 根据学号查询信息

```vb
Sub chaxun()
'On Error Resume Next  表示后面的程序出现"运行时错误"时，会继续运行，不中断
'VLookup（a,b,c,d） a：搜索的值  b：搜索的区域（多列） c：返回哪一列  d：是否精确匹配

On Error Resume Next
Sheets(1).Range("d14:d22").ClearContents
d = Sheets(1).Range("d9")
For j = 2 To Sheets.Count
    Sheets(1).Range("d14") = WorksheetFunction.VLookup(d, Sheets(j).Range("a:h"), 5, 0)
    Sheets(1).Range("d16") = WorksheetFunction.VLookup(d, Sheets(j).Range("a:h"), 6, 0)
    Sheets(1).Range("d18") = WorksheetFunction.VLookup(d, Sheets(j).Range("a:h"), 3, 0)
    Sheets(1).Range("d20") = WorksheetFunction.VLookup(d, Sheets(j).Range("a:h"), 8, 0)
    Sheets(1).Range("d22") = Sheets(j).Name
    If Sheets(1).Range("d14") <> "" Then
        Exit For
    End If
Next
End Sub

Sub tongji()
'WorksheetFunction 通过该对象可以使用工作表函数
'CountA(a) a为某一区域，计算非空单元格
'CountIf(a,b) a为某一区域，b为条件，统计满足条件的单元格
For i = 2 To Sheets.Count
    k = k + WorksheetFunction.CountA(Sheets(i).Range("a:a")) - 1
    m = m + WorksheetFunction.CountIf(Sheets(i).Range("f:f"), "男")
    w = w + WorksheetFunction.CountIf(Sheets(i).Range("f:f"), "女")
Next
Sheets(1).Range("d26") = k
Sheets(1).Range("d27") = m
Sheets(1).Range("d28") = w
End Sub
```

### 拆分多表通用型

```vbscript
Sub chaifenshuju()

Dim sht As Worksheet
Dim k, i, j As Integer
Dim irow As Integer '这个说的是一共多少行
Dim l As Integer
Dim str As String '这里是第1处修改，加入一个变量，用于提取当前工作表的名字
str = ActiveSheet.Name '这里是第2处修改，取得当前要处理的表的名字
l = InputBox("请输入你要按哪列分")
'删除无意义的表
Application.DisplayAlerts = False
If Sheets.Count > 1 Then
    For Each sht1 In Sheets
        If sht1.Name <> str Then '这里是第3处修改，不在用“数据”这个固定的名字了，而是用之前取到的名字
            sht1.Delete
        End If
    Next
End If
Application.DisplayAlerts = True '这个地方上课的时候我没改成true，请大家注意一下
irow = Sheets(str).Range("a65536").End(xlUp).Row '这里是第4处修改，不在用“sheet1”这个固定的表名字了，而是用之前取到的名字的表
'拆分表
For i = 2 To irow
    k = 0
    For Each sht In Sheets
        If sht.Name = Sheets(str).Cells(i, l) Then '这里是第5处修改，跟第四个修改一样，把原来的sheet1替换成sheets(str)
            k = 1
        End If
    Next
    If k = 0 Then
        Sheets.Add after:=Sheets(Sheets.Count)
        Sheets(Sheets.Count).Name = Sheets(str).Cells(i, l)   '这里是第6处修改，跟第四个修改一样，把原来的sheet1替换成sheets(str)
    End If
Next
'拷贝数据   注意：第7处修改。原有的Range("a1:f" & irow)已经改为Range("a1:z" & irow)  因为数据可能会列数很多，所以写成到z列，故意多写一些。￥￥￥￥￥￥￥￥￥￥￥￥￥
For j = 2 To Sheets.Count
    Sheets(str).Range("a1:z" & irow).AutoFilter Field:=l, Criteria1:=Sheets(j).Name  '这里是第8处修改，跟第四个修改一样，把原来的sheet1替换成sheets(str)
    Sheets(str).Range("a1:z" & irow).Copy Sheets(j).Range("a1")  '这里是第9处修改，跟第四个修改一样，把原来的sheet1替换成sheets(str)￥￥￥￥￥￥￥￥￥￥￥
Next
Sheets(str).Range("a1:z" & irow).AutoFilter   '这里是第10处修改，跟第四个修改一样，把原来的sheet1替换成sheets(str)
Sheets(str).Select   '这里是第11处修改，跟第四个修改一样，把原来的sheet1替换成sheets(str)
MsgBox "已处理完毕，牛逼不"
End Sub
```

## 多文件数据合并

### Dir

1. Dir(文件路径)：存在文件返回文件名，不存在返回空值
2. dir后面的参数可以支持通配符，例如：Dir("d:/data/苏州.xls*")

### 查询某文件下所有文件名

```vbscript
'遍历文件，并提取文件名，以下代码会将data下所有文件名写入A列'
Sub test()
    Dim name As String, i
    i = 1
    name = Dir("G:\code\vba\VBA10\data\*.*")
    Do
        Sheets("data").Range("a" & i) = name
        name = Dir  '当dir() 查询结果有多个文件时，dir则依次返回一个文件名，然后为空，再然后出错
        i = i + 1
    Loop While name <> ""
End Sub
```

### 文件合并

```vbscript
Sub 合并多文件数据()
Application.ScreenUpdating = False
    Dim name As String, i, wb As Workbook, sht As Worksheet
    i = 1
    name = Dir("G:\code\vba\跟着王佩丰学VBA附件\VBA10\data2\*.*")
    Do
        Set wb = Workbooks.Open("G:\code\vba\跟着王佩丰学VBA附件\VBA10\data2\" & name)
        For Each sht In wb.Sheets
            sht.Copy after:=ThisWorkbook.Sheets(ThisWorkbook.Sheets.Count) '需指定哪个工作簿
            'split 拆分字符串，返回一个数组
            ThisWorkbook.Sheets(ThisWorkbook.Sheets.Count).name = Split(wb.name, ".")(0) & sht.name
        Next
        name = Dir
        wb.Close
    Loop While name <> ""
Application.ScreenUpdating = True
End Sub
```

### find用法（规避错误）

```vbscript
Sub chazhao()
	Dim rng As Range
    '如果找不到以下代码并不会报错，而是rng为空'
	Set rng = Range("d:d").Find(Range("l3"))
    '进行以下判断，这样就可以避免错误'
	If Not rng Is Nothing Then
         Range("m3") = rng.Offset(0, 3)
	End If

End Sub
```



### 拆分工作表通用

```vbscript
Sub chaifenshuju()
Dim sht As Worksheet
Dim k, i, j As Integer
Dim irow As Integer '这个说的是一共多少行
Dim l As Integer
Dim sht0 As Worksheet
Set sht0 = ActiveSheet '需要拆分的表'
l = InputBox("请输入你要按哪列分")

'删除无意义的表
Application.DisplayAlerts = False
If Sheets.Count > 1 Then
    For Each sht1 In Sheets
        If sht1.Name <> sht0.Name Then
            sht1.Delete
        End If
    Next
End If
Application.DisplayAlerts = True 

irow = sht0.Range("a65536").End(xlUp).Row
'拆分表
For i = 2 To irow
    k = 0
    For Each sht In Sheets
        If sht.Name = sht0.Cells(i, l) Then
            k = 1
        End If
    Next

    If k = 0 Then
        Sheets.Add after:=Sheets(Sheets.Count)
        Sheets(Sheets.Count).Name = sht0.Cells(i, l)
    End If

Next

'拷贝数据
For j = 2 To Sheets.Count
    sht0.Range("a1:z" & irow).AutoFilter Field:=l, Criteria1:=Sheets(j).Name
    sht0.Range("a1:z" & irow).Copy Sheets(j).Range("a1")
Next

sht0.Range("a1:z" & irow).AutoFilter
sht0.Select
MsgBox "已处理完毕，牛逼不"

End Sub
```

## 数组的妙用

### 统计金额

```vbscript
Sub 总金额1()

Dim i, xrow, j, k, str, ti

ti = Timer

xrow = Range("a1000000").End(xlUp).Row
ReDim arr(1 To 3, 1 To xrow)
str = Range("O5").Value
For i = 2 To xrow
    If Range("H" & i) = str Then
        k = k + Range("J" & i)
        j = j + Range("L" & i)
    End If
Next

Range("P5") = k
Range("Q5") = k

MsgBox (Format(Timer - ti, "0.000000"))
End Sub
------------------------------------------------------------------------
Sub 总金额2()

Dim i, xrow, j, k, str, ti, arr()

ti = Timer	'获取时间'

xrow = Range("a1000000").End(xlUp).Row	
ReDim arr(1 To 3, 1 To xrow)	'重新定义数组大小'
str = Range("O5").Value
arr = Range("H1:J" & xrow).Value	'连续的将单元格区域赋值给数组，注意：带sheets.range(区域)，后面必须跟上value'
For i = 2 To xrow
    If arr(i, 1) = str Then
        k = k + arr(i, 3)
        j = j + arr(i, 2)
    End If
Next

Range("P5") = k

MsgBox (Format(Timer - ti, "0.000000"))	'当前获取时间-程序开始时间，结果为程序运行时间'
End Sub
```

### 查找销冠

```vbscript
Sub test()
Dim arr()
Dim j, i As Integer

j = Range("a65536").End(xlUp).Row - 1

ReDim arr(1 To j)	'重新定义数组大小'

For i = 1 To j
    arr(i) = Range("b" & i + 1) * Range("c" & i + 1)
Next

Range("h3") = Application.WorksheetFunction.Max(arr)	'调用工作表函数，数组可以看成一个单元格区域'
'match，查看元素在区域内出现的位置'
Range("h2") = Range("a" & Application.WorksheetFunction.Match(Range("h3"), arr, 0) + 1)

MsgBox LBound(arr) '数组下限'

End Sub
```

### 计算回款信息

```vbscript
'问题：有许多汇款账单，但不知道谁是谁，现在知道收到的回款总额(124704)以及订单数(4)，求是哪些账单（每个账单金额唯一）'
'思路：尝试组合所有可能的组合，将金额加起来为124704的订单找出来'
Sub huikuan()
Dim arr(), i, j, k, xrow, t
t = Timer
xrow = Range("a65535").End(xlUp).Row - 1
arr = Range("A2:A" & xrow + 1)
For i = 1 To xrow
    For j = 1 To xrow
        For k = 1 To xrow
            For l = 1 To xrow
                If arr(i, 1) + arr(j, 1) + arr(k, 1) + arr(l, 1) = Range("k3") Then '四笔订单和为收到汇款总额时
                    Range("F3") = arr(i, 1)
                    Range("G3") = arr(j, 1)
                    Range("H3") = arr(k, 1)
                    Range("I3") = arr(k, 1)
                    GoTo 100    '程序跳到100处，这里结束所有循环
                End If
            Next
        Next
    Next
Next
100
Range("L3") = Timer - t '程序执行时间
End Sub
```

## ADO

```vb
Sub adoTest()
Dim conn As New ADODB.Connection
Dim sql As String, arr()

conn.Open "Provider = Microsoft.ACE.OLEDB.12.0;Data Source=G:\data\Edata.xlsx;extended properties=""excel 12.0;HDR=YES""" '打开excle文件，指定扩展属性以及表头

'conn.Open "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=D:\data\Adata.accdb" '打开access数据库，只需要指定提供者和数据源

'conn.Open "Provider=SQLOLEDB;DataSource=" & Path & ";Initial Catolog=" & strDataName 'Mysql数据库

'conn.Open "Provider=MSDASQL;Driver={SQL Server};Server=" & Path & ";Database=" & strDataName 'MSSQL数据库

'conn.Open "Provider=madaora;Data Source=MyOracleDB; User Id=UserID; Password=Password" 'Oracle数据库

sql = "select * from [data$]" '从data工作表查询所有数据
sql = "select * from [data$] where 性别=男" '条件查询
sql = "select * from [data$] union all select * from [data2$]" '合并两个表数据

Range("a2").CopyFromRecordset conn.Execute(sql) '将查询的记录写入A2单元格

arr = Application.WorksheetFunction.Transpose(conn.Execute(sql).GetRows)    '将查询的记录赋值到数组

'关闭链接
conn.Close
End Sub
```

