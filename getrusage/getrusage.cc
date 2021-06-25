#include <sys/resource.h>
#include <napi.h>

Napi::Object getrusageNapi(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // https://www.gnu.org/software/libc/manual/html_node/Resource-Usage.html
  int who = ((info.Length() > 0 && info[0].IsNumber()) ? info[0].ToNumber().Int32Value() : RUSAGE_SELF);
  struct rusage ru;
  int flag = getrusage(who, &ru);

  if (flag == -1) {
    Napi::Error::New(env, "getrusage() call failed!").ThrowAsJavaScriptException();
    return Napi::Object::New(env);
  }

  Napi::Object usage = Napi::Object::New(env);
  usage.Set(Napi::String::New(env, "utime"), Napi::Number::New(env, (double)ru.ru_utime.tv_sec + (double)ru.ru_utime.tv_usec * 1e-6));
  usage.Set(Napi::String::New(env, "stime"), Napi::Number::New(env, (double)ru.ru_stime.tv_sec + (double)ru.ru_stime.tv_usec * 1e-6));
  usage.Set(Napi::String::New(env, "maxrss"), Napi::Number::New(env, ru.ru_maxrss));
  usage.Set(Napi::String::New(env, "ixrss"), Napi::Number::New(env, ru.ru_ixrss));
  usage.Set(Napi::String::New(env, "idrss"), Napi::Number::New(env, ru.ru_idrss));
  usage.Set(Napi::String::New(env, "isrss"), Napi::Number::New(env, ru.ru_isrss));
  usage.Set(Napi::String::New(env, "minflt"), Napi::Number::New(env, ru.ru_minflt));
  usage.Set(Napi::String::New(env, "majflt"), Napi::Number::New(env, ru.ru_majflt));
  usage.Set(Napi::String::New(env, "nswap"), Napi::Number::New(env, ru.ru_nswap));
  usage.Set(Napi::String::New(env, "inblock"), Napi::Number::New(env, ru.ru_inblock));
  usage.Set(Napi::String::New(env, "oublock"), Napi::Number::New(env, ru.ru_oublock));
  usage.Set(Napi::String::New(env, "msgsnd"), Napi::Number::New(env, ru.ru_msgsnd));
  usage.Set(Napi::String::New(env, "msgrcv"), Napi::Number::New(env, ru.ru_msgrcv));
  usage.Set(Napi::String::New(env, "nsignals"), Napi::Number::New(env, ru.ru_nsignals));
  usage.Set(Napi::String::New(env, "nvcsw"), Napi::Number::New(env, ru.ru_nvcsw));
  usage.Set(Napi::String::New(env, "nivcsw"), Napi::Number::New(env, ru.ru_nivcsw));

  return usage;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "RUSAGE_SELF"), Napi::Number::New(env, RUSAGE_SELF));
  exports.Set(Napi::String::New(env, "RUSAGE_CHILDREN"), Napi::Number::New(env, RUSAGE_CHILDREN));
  exports.Set(Napi::String::New(env, "getrusage"), Napi::Function::New(env, getrusageNapi));

  return exports;
}

NODE_API_MODULE(getrusage, Init)
