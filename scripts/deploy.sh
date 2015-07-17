#!/bin/bash
 
ccred=$(echo -e "\033[0;31m")
ccyellow=$(echo -e "\033[0;33m")
ccgreen=$(echo -e "\033[0;32m")
ccend=$(echo -e "\033[0m")
 
exit_code=0
 
cd "$(git rev-parse --show-toplevel)"
 
# #Minify
# echo -e "$ccyellow========Minify========$ccend"
# for ext in 'css' 'js'
# do
#     for infile in `find ./app -name *.$ext |grep -v min`
#     do
#         outfile="$(echo $infile |sed 's/\(.*\)\..*/\1/').min.$ext"
#         echo -n -e "\nMinifying $infile to $outfile: "
#         if [ ! -f "$outfile" ] || [ "$infile" -nt "$outfile" ]
#         then
#             yuicompressor "$infile" > "$outfile"
#             if [ `echo $?` != 0 ]
#             then
#                 exit_code=1
#                 echo -e "\n$ccred========Failed minification of $infile to $outfile . Reverting========$ccend\n" >&2
#                 git checkout -- "$outfile" || rm -f "$outfile"
#             else
#                 echo $ccgreen Success.$ccend
#             fi
#         else
#             echo $ccgreen Not modified.$ccend
#         fi
#     done
# done
 
#Compress / Copy
echo -e "\n\n$ccyellow========Compress / Copy========$ccend\n"
for infile in `find ./app -type f -not -empty`
do
    filetype="$(grep -r -m 1 "^" "$infile" |grep '^Binary file')"
    outfile="./build/$(echo $infile |cut -c7-)"
 
    mkdir -p $(dirname "$outfile")
    if [ ! -f "$outfile" ] || [ "$infile" -nt "$outfile" ]
    then
        if [ "$filetype" = "" ] #Compress text files
        then
            echo -n -e "\nCompressing $infile to $outfile: "
            gzip -c "$infile" > "$outfile"
        else #Copy binary files as is
            echo -e -n "\nCopying $infile to $outfile: "
            cp "$infile" "$outfile"
        fi
        if [ `echo $?` != 0 ]
        then
            exit_code=2
            echo -e "\n$ccred========Failed compress / copy of $infile to $outfile . Reverting========$ccend" >&2
        else
            echo $ccgreen Success.$ccend
        fi
    else
        echo -e "$infile -> $outfile: $ccgreen Not modified.$ccend"
    fi
done
 
echo -e "\n$ccyellow========Finished========$ccend"
exit $exit_code