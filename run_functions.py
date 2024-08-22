



import subprocess
# Command 1
command0 = "echo  🧡 💛 💚 Build and Start Functions Locally"
process0 = subprocess.Popen(command0, shell=True)
# Command 1
command1 = "npm run build"
process1 = subprocess.Popen(command1, shell=True)
process1.wait()  

# Command 2
command2 = "npm run start"
process2 = subprocess.Popen(command2, shell=True)
