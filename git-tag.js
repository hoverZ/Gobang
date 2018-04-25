let exec = require('child_process').exec;

//获取最新的两个 tag 
const gitGetLastetTag = "git describe --tags `git rev-list --tags --max-count=2`";



// git log --pretty=oneline ...v0.2
// --pretty=format:"commit %H %cn %ce %cd %s" --date=format:'%Y-%m-%d %H:%M:%S'
exec( gitGetLastetTag, function(err, stdout, stderr){
    const pretty = " --pretty=format:'{[@commit@]:[@%H@],[@commiter@]:[@%cn@],[@email@]:[@%ce@],[@datetime@]:[@%cd@],[@log@]:[@%s@]}$$' --date=format:'%Y-%m-%d %H:%M:%S' ";
    let gitLog = "git log";
    if(err){
        console.log("error: "+err);
        return;
    }
    stdout = stdout.trim("\n");
    let tagList = stdout.split("\n");
    if(tagList.length == 0){
        console.log("没有tag");
        return;
    }else if(tagList.length == 1){
        console.log("有一个tag");
        gitLog = "git log" + pretty + tagList[0];
    }else{
        console.log(tagList);
        gitLog = "git log" + pretty + tagList[0]+"..."+tagList[1];
    }
    exec(gitLog, function(err, stdout, stderr){
        stdout = stdout.replace(/(\[@)|(@\])/g,"\"");
        console.log(JSON.parse(stdout));
    })
});

