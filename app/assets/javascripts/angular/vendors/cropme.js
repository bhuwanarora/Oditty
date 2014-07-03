(function() {
  angular.module("cropme", ["ngSanitize"]).directive("cropme", [
    "$window", "$timeout", "$rootScope", function($window, $timeout, $rootScope) {
      var borderSensitivity, checkScopeVariables, minHeight, offset;
      minHeight = 100;
      borderSensitivity = 8;
      checkScopeVariables = function(scope) {
        if (scope.destinationHeight) {
          if (scope.ratio) {
            scope.error = "You can't specify both destinationHeight and ratio, destinationHeight = destinationWidth * ratio";
          } else {
            scope.ratio = scope.destinationHeight / scope.destinationWidth;
          }
        } else if (scope.ratio) {
          scope.destinationHeight = scope.destinationWidth * scope.ratio;
        }
        if (scope.ratio && scope.height && scope.destinationHeight > scope.height) {
          scope.error  = "Can't initialize cropme: destinationWidth x ratio needs to be lower than height";
        }
        if (scope.destinationWidth > scope.width) {
          scope.error  = "Can't initialize cropme: destinationWidth x ratio needs to be lower than height";
        }
        if (scope.destinationWidth > scope.width) {
          scope.error = "Can't initialize cropme: destinationWidth needs to be lower than width";
        }
        if (scope.ratio && !scope.height) {
          scope.height = scope.destinationHeight;
        }
        return scope.type || (scope.type = "png");
      };
      offset = function(el) {
        var offsetLeft, offsetTop;
        offsetTop = 0;
        offsetLeft = 0;
        while (el) {
          offsetTop += el.offsetTop;
          offsetLeft += el.offsetLeft;
          el = el.offsetParent;
        }
        return {
          top: offsetTop,
          left: offsetLeft
        };
      };
      return {
        templateUrl: "/assets/angular/widgets/base/widget/cropme.html",
        restrict: "E",
        scope: {
          width: "=",
          maxHeight: "=",
          destinationWidth: "=",
          height: "=?",
          destinationHeight: "=?",
          iconClass: "=?",
          ratio: "=?",
          type: "=?"
        },
        link: function(scope, element, attributes) {
          var $input, canvasEl, checkBounds, checkHRatio, checkVRatio, ctx, draggingFn, elOffset, grabbedBorder, heightWithImage, imageAreaEl, imageEl, isNearBorders, moveBorders, moveCropZone, nearHSegment, nearVSegment, startCropping, zoom;
          scope.dropText = "Drop picture here";
          scope.showButton = true;
          scope.error = null;
          draggingFn = null;
          grabbedBorder = null;
          heightWithImage = null;
          zoom = null;
          elOffset = null;
          imageEl = element.find('img')[0];
          canvasEl = element.find("canvas")[0];
          ctx = canvasEl.getContext("2d");
          startCropping = function(imageWidth, imageHeight) {
            zoom = scope.width / imageWidth;
            heightWithImage = imageHeight * zoom;
            scope.img_width = scope.width;
            if(heightWithImage > scope.maxHeight){
              heightWithImage = scope.maxHeight;
              zoom = heightWithImage / imageHeight;
              scope.img_width = imageWidth * zoom;
            }
            scope.widthCropZone = Math.round(scope.destinationWidth * zoom);
            scope.heightCropZone = Math.round((scope.destinationHeight || minHeight) * zoom);
            scope.xCropZone = Math.round((scope.img_width - scope.widthCropZone) / 2);
            scope.yCropZone = Math.round((heightWithImage - scope.heightCropZone) / 2);
            return $timeout(function() {
              return elOffset = offset(imageAreaEl);
            });
          };
          imageAreaEl = element[0].getElementsByClassName("step-2")[0];
          checkScopeVariables(scope);
          scope.width_vh = scope.destinationWidth*100/document.documentElement.clientHeight;
          scope.height_vh = scope.destinationHeight*100/document.documentElement.clientHeight;
          // scope.width *= document.documentElement.clientWidth/100;
          // scope.height *= document.documentElement.clientHeight/100;
          // scope.destinationHeight *= document.documentElement.clientHeight/100;
          // scope.destinationWidth *= document.documentElement.clientHeight/100;
          $input = element.find("input");
          $input.bind("change", function() {
            var file;
            file = this.files[0];
            return scope.$apply(function() {
              return scope.setFiles(file);
            });
          });
          $input.bind("click", function(e) {
            e.stopPropagation();
            return $input.val("");
          });
          scope.browseFiles = function() {
            scope.error = null;
            return $input[0].click();
          };
          scope.setFiles = function(file) {
            var reader;
            if (!file.type.match(/^image\//)) {
              scope.error = "Wrong file type, please select an image.";
              return scope.dropError = "Wrong file type, please select an image.";
            }
            scope.dropError = "";
            reader = new FileReader;
            reader.onload = function(e) {
              imageEl.onload = function() {
                var errors, height, width;
                width = imageEl.naturalWidth;
                height = imageEl.naturalHeight;
                errors = [];
                if (width < scope.width) {
                  scope.error = "Please choose an image with minimum size " + scope.width + " x " + Math.round(scope.destinationHeight) + " px."
                  errors.push("The image you dropped has a width of " + width + ",px but the minimum is " + scope.width + ".");
                }
                if (scope.height && height < scope.height) {
                  scope.error = "Please choose an image with minimum size " + scope.width + " x " + Math.round(scope.destinationHeight) + " px."
                  errors.push("The image you dropped has a height of " + height + ", but the minimum is " + scope.height + ".");
                }
                if (scope.ratio && scope.destinationHeight > height) {
                  scope.error = "Please choose an image with minimum size " + scope.width + " x " + Math.round(scope.destinationHeight) + " px."
                  errors.push("The image you dropped has a height of " + height + ", but the minimum is " + scope.destinationHeight + ".");
                }
                return scope.$apply(function() {
                  if (errors.length) {
                    return scope.dropError = errors.join("<br/>");
                  } else {
                    $rootScope.$broadcast("cropme:loaded", width, height);
                    scope.showButton = false;
                    return startCropping(width, height);
                  }
                });
              };
              return scope.$apply(function() {
                return scope.imgSrc = e.target.result;
              });
            };
            return reader.readAsDataURL(file);
          };
          moveCropZone = function(ev) {
            scope.xCropZone = ev.clientX - elOffset.left - scope.widthCropZone / 2;
            scope.yCropZone = ev.clientY - elOffset.top - scope.heightCropZone / 2;
            return checkBounds();
          };
          moveBorders = {
            top: function(ev) {
              var y;
              y = ev.clientY - elOffset.top;
              scope.heightCropZone += scope.yCropZone - y;
              scope.yCropZone = y;
              checkVRatio();
              return checkBounds();
            },
            right: function(ev) {
              var x;
              x = ev.clientX - elOffset.left;
              scope.widthCropZone = x - scope.xCropZone;
              checkHRatio();
              return checkBounds();
            },
            bottom: function(ev) {
              var y;
              y = ev.clientY - elOffset.top;
              scope.heightCropZone = y - scope.yCropZone;
              checkVRatio();
              return checkBounds();
            },
            left: function(ev) {
              var x;
              x = ev.clientX - elOffset.left;
              scope.widthCropZone += scope.xCropZone - x;
              scope.xCropZone = x;
              checkHRatio();
              return checkBounds();
            }
          };
          checkHRatio = function() {
            if (scope.ratio) {
              return scope.heightCropZone = scope.widthCropZone * scope.ratio;
            }
          };
          checkVRatio = function() {
            if (scope.ratio) {
              return scope.widthCropZone = scope.heightCropZone / scope.ratio;
            }
          };
          checkBounds = function() {
            if (scope.xCropZone < 0) {
              scope.xCropZone = 0;
            }
            if (scope.yCropZone < 0) {
              scope.yCropZone = 0;
            }
            if (scope.widthCropZone < scope.destinationWidth * zoom) {
              scope.widthCropZone = scope.destinationWidth * zoom;
              checkHRatio();
            } else if (scope.destinationHeight && scope.heightCropZone < scope.destinationHeight * zoom) {
              scope.heightCropZone = scope.destinationHeight * zoom;
              checkVRatio();
            }
            if (scope.xCropZone + scope.widthCropZone > scope.img_width) {
              scope.xCropZone = scope.img_width - scope.widthCropZone;
              if (scope.xCropZone < 0) {
                scope.widthCropZone = scope.img_width;
                scope.xCropZone = 0;
                checkHRatio();
              }
            }
            if (scope.yCropZone + scope.heightCropZone > heightWithImage) {
              scope.yCropZone = heightWithImage - scope.heightCropZone;
              if (scope.yCropZone < 0) {
                scope.heightCropZone = heightWithImage;
                scope.yCropZone = 0;
                return checkVRatio();
              }
            }
          };
          isNearBorders = function(ev) {
            var bottomLeft, bottomRight, h, topLeft, topRight, w, x, y;
            x = scope.xCropZone + elOffset.left;
            y = scope.yCropZone + elOffset.top;
            w = scope.widthCropZone;
            h = scope.heightCropZone;
            topLeft = {
              x: x,
              y: y
            };
            topRight = {
              x: x + w,
              y: y
            };
            bottomLeft = {
              x: x,
              y: y + h
            };
            bottomRight = {
              x: x + w,
              y: y + h
            };
            return nearHSegment(ev, x, w, y, "top") || nearVSegment(ev, y, h, x + w, "right") || nearHSegment(ev, x, w, y + h, "bottom") || nearVSegment(ev, y, h, x, "left");
          };
          nearHSegment = function(ev, x, w, y, borderName) {
            if (ev.clientX >= x && ev.clientX <= x + w && Math.abs(ev.clientY - y) <= borderSensitivity) {
              return borderName;
            }
          };
          nearVSegment = function(ev, y, h, x, borderName) {
            if (ev.clientY >= y && ev.clientY <= y + h && Math.abs(ev.clientX - x) <= borderSensitivity) {
              return borderName;
            }
          };
          scope.mousedown = function(e) {
            grabbedBorder = isNearBorders(e);
            if (grabbedBorder) {
              draggingFn = moveBorders[grabbedBorder];
            } else {
              draggingFn = moveCropZone;
            }
            return draggingFn(e);
          };
          scope.mouseup = function(e) {
            if (draggingFn) {
              draggingFn(e);
            }
            return draggingFn = null;
          };
          scope.mousemove = function(e) {
            if (draggingFn) {
              draggingFn(e);
            }
            return scope.colResizePointer = isNearBorders(e);
          };
          scope.deselect = function() {
            return draggingFn = null;
          };
          scope.cancel = function() {
            scope.dropText = "Drop files here";
            scope.dropClass = "";
            return scope.showButton = true;
          };
          scope.ok = function() { 
            scope.croppedWidth = scope.widthCropZone / zoom;
            scope.croppedHeight = scope.heightCropZone / zoom;
            scope.set=true;
            return $timeout(function() {
              var destinationHeight;
              destinationHeight = scope.destinationHeight || scope.destinationWidth * scope.croppedHeight / scope.croppedWidth;
              ctx.drawImage(imageEl, scope.xCropZone / zoom, scope.yCropZone / zoom, scope.croppedWidth, scope.croppedHeight, 0, 0, scope.destinationWidth, scope.destinationHeight);
              return canvasEl.toBlob(function(blob) {
                return ($rootScope.$broadcast("cropme:done", blob))&&(scope.showButton = true);
              }, 'image/' + scope.type);
            });
          };
          scope.$on("cropme:cancel", scope.cancel);
          return scope.$on("cropme:ok", scope.ok);
        }
      };
    }
  ]);

  angular.module("cropme").directive("dropbox", function() {
    return {
      restrict: "E",
      link: function(scope, element, attributes) {
        var dragEnterLeave, dropbox;
        dragEnterLeave = function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          return scope.$apply(function() {
            scope.dropText = "Drop files here";
            return scope.dropClass = "";
          });
        };
        dropbox = element[0];
        scope.dropText = "Drop files here";
        dropbox.addEventListener("dragenter", dragEnterLeave, false);
        dropbox.addEventListener("dragleave", dragEnterLeave, false);
        dropbox.addEventListener("dragover", (function(evt) {
          var ok;
          evt.stopPropagation();
          evt.preventDefault();
          ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf("Files") >= 0;
          return scope.$apply(function() {
            scope.dropText = (ok ? "Drop now" : "Only files are allowed");
            return scope.dropClass = (ok ? "over" : "not-available");
          });
        }), false);
        return dropbox.addEventListener("drop", (function(evt) {
          var files;
          evt.stopPropagation();
          evt.preventDefault();
          scope.$apply(function() {
            scope.dropText = "Drop files here";
            return scope.dropClass = "";
          });
          files = evt.dataTransfer.files;
          return scope.$apply(function() {
            var file, _i, _len;
            if (files.length > 0) {
              for (_i = 0, _len = files.length; _i < _len; _i++) {
                file = files[_i];
                if (file.type.match(/^image\//)) {
                  scope.dropText = "Loading image...";
                  scope.dropClass = "loading";
                  return scope.setFiles(file);
                }
                scope.dropError = "Wrong file type, please drop at least an image.";
              }
            }
          });
        }), false);
      }
    };
  });

  (function(view) {
    "use strict";
    var HTMLCanvasElement, Uint8Array, base64_ranks, decode_base64, is_base64_regex;
    Uint8Array = view.Uint8Array;
    HTMLCanvasElement = view.HTMLCanvasElement;
    is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i;
    base64_ranks = void 0;
    decode_base64 = function(base64) {
      var buffer, code, i, last, len, outptr, rank, save, state, undef;
      len = base64.length;
      buffer = new Uint8Array(len / 4 * 3 | 0);
      i = 0;
      outptr = 0;
      last = [0, 0];
      state = 0;
      save = 0;
      rank = void 0;
      code = void 0;
      undef = void 0;
      while (len--) {
        code = base64.charCodeAt(i++);
        rank = base64_ranks[code - 43];
        if (rank !== 255 && rank !== undef) {
          last[1] = last[0];
          last[0] = code;
          save = (save << 6) | rank;
          state++;
          if (state === 4) {
            buffer[outptr++] = save >>> 16;
            if (last[1] !== 61) {
              buffer[outptr++] = save >>> 8;
            }
            if (last[0] !== 61) {
              buffer[outptr++] = save;
            }
            state = 0;
          }
        }
      }
      return buffer;
    };
    if (Uint8Array) {
      base64_ranks = new Uint8Array([62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);
    }
    if (HTMLCanvasElement && !HTMLCanvasElement.prototype.toBlob) {
      return HTMLCanvasElement.prototype.toBlob = function(callback, type) {
        var args, blob, data, dataURI, header_end, is_base64;
        if (!type) {
          type = "image/png";
        }
        if (this.mozGetAsFile) {
          callback(this.mozGetAsFile("canvas", type));
          return;
        }
        args = Array.prototype.slice.call(arguments, 1);
        dataURI = this.toDataURL.apply(this, args);
        header_end = dataURI.indexOf(",");
        data = dataURI.substring(header_end + 1);
        is_base64 = is_base64_regex.test(dataURI.substring(0, header_end));
        blob = void 0;
        if (Blob.fake) {
          blob = new Blob;
          if (is_base64) {
            blob.encoding = "base64";
          } else {
            blob.encoding = "URI";
          }
          blob.data = data;
          blob.size = data.length;
        } else if (Uint8Array) {
          if (is_base64) {
            blob = new Blob([decode_base64(data)], {
              type: type
            });
          } else {
            blob = new Blob([decodeURIComponent(data)], {
              type: type
            });
          }
        }
        return callback(blob);
      };
    }
  })(self);

}).call(this);