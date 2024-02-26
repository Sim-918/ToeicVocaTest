from fastapi import FastAPI, Request,Query
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import random
from vocabook import *

app = FastAPI()

templates = Jinja2Templates(directory="templates")

# 정적 파일 제공
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/vocabook")
async def home(request: Request):
    return templates.TemplateResponse("vocabook.html", {"request": request})

@app.get("/vocabook={day_num}")
async def get_exam_data(day_num:int):
    book=dict()
    if day_num==0:
        book['day'],book['words']=day_num,"select plz"
        return JSONResponse(content=book)
    words=eval(f"day_{day_num}")
    book['day'],book['words']=day_num,words
    return JSONResponse(content=book)


@app.get("/quiz")
async def exam(request: Request,day:int=Query(...)):
    return templates.TemplateResponse("test.html", {"request": request,"day":day})


@app.get("/day={day_num}/test={test_num}")
async def get_exam_data(day_num:int,test_num:int):
    data=dict()
    word=eval(f"day_{day_num}")
    if test_num>=len(word):
        data=None
        return JSONResponse(content=data)
    data['topic'],data['context'],data['tmp'],data['bar_len']=create_data(word,test_num)
    return JSONResponse(content=data)

def create_data(word,num):
    ans=word.pop(num)
    sunji=random.sample(word,3)
    context=[ans[1]]+[s[1] for s in sunji]
    random.shuffle(context)
    word.insert(num,ans)
    topic=word[num][0]
    num+=1
    bar_len=int((num/len(word))*100)
    return topic,context,num,bar_len

check=[]
result=[]
now_day=[]

@app.post("/receive_data")
async def report(request: Request):
    global check,result,now_day
    data=await request.json()
    day_word=eval(f"day_{data['day_num']}")
    now_day=data['day_num']
    check=[0]*len(day_word)
    for i in range(len(day_word)):
        if data['report_data'][i]==day_word[i][1]:
            check[i]=True
        elif data['report_data'][i]=='skip':
            check[i]=None
        else:
            check[i]=False
    result=[{"item": item, "is_correct": is_correct} for item, is_correct in zip(day_word, check)]
    


@app.get("/report")
async def home(request: Request):
    return templates.TemplateResponse("report.html", {"request": request,
                                                      "check":check,
                                                      "result":result,
                                                      "total_len":len(check),
                                                      "now_day":now_day})

