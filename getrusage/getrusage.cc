/**
 * modify from https://github.com/andrasq/node-qrusage/blob/1.5.2/qrusage.cc
 */

#include <nan.h>
using v8::FunctionTemplate;

#include <sys/time.h>
#include <sys/resource.h>

// extract the integer passed as the first argument
static int getIntArg( Nan::NAN_METHOD_ARGS_TYPE info, int index ) {
    int defaultValue = RUSAGE_SELF;
    return Nan::To<int32_t>(info[index]).FromMaybe(defaultValue);
}

NAN_METHOD( getrusage_array ) {
    struct rusage ru;
    int who = (info[0]->IsNumber()) ? getIntArg(info, 0) : RUSAGE_SELF;

    getrusage(who, &ru);

    // faster to zero-detect than to create new Number every time
    v8::Local<v8::Number> zero = Nan::New(0);
    #define _number(v)     (((v) > 0) ? Nan::New((double)v) : zero)

    // note: nan-2.2.0 is unable to Nan::New() a long (ambiguous), cast to double
    v8::Local<v8::Array> usage_array = Nan::New<v8::Array>(16);
    Nan::Set(usage_array, 0, Nan::New((double)ru.ru_utime.tv_sec + (double)ru.ru_utime.tv_usec * 1e-6));
    Nan::Set(usage_array, 1, Nan::New((double)ru.ru_stime.tv_sec + (double)ru.ru_stime.tv_usec * 1e-6));
    Nan::Set(usage_array, 2, Nan::New((double)ru.ru_maxrss));
    Nan::Set(usage_array, 4,  _number(ru.ru_ixrss));
    Nan::Set(usage_array, 3,  _number(ru.ru_idrss));
    Nan::Set(usage_array, 5,  _number(ru.ru_isrss));
    Nan::Set(usage_array, 6, Nan::New((double)ru.ru_minflt));
    Nan::Set(usage_array, 7,  _number(ru.ru_majflt));
    Nan::Set(usage_array, 8,  _number(ru.ru_nswap));
    Nan::Set(usage_array, 9,  _number(ru.ru_inblock));
    Nan::Set(usage_array, 10, _number(ru.ru_oublock));
    Nan::Set(usage_array, 11, _number(ru.ru_msgsnd));
    Nan::Set(usage_array, 12, _number(ru.ru_msgrcv));
    Nan::Set(usage_array, 13, _number(ru.ru_nsignals));
    Nan::Set(usage_array, 14, Nan::New((double)ru.ru_nvcsw));
    Nan::Set(usage_array, 15, Nan::New((double)ru.ru_nivcsw));

    info.GetReturnValue().Set(usage_array);
}

NAN_MODULE_INIT(Init) {
    Nan::Set(target, Nan::New("getrusageArray").ToLocalChecked(),       Nan::GetFunction(Nan::New<FunctionTemplate>(getrusage_array)).ToLocalChecked()),
    Nan::Set(target, Nan::New("RUSAGE_SELF").ToLocalChecked(),          Nan::New(RUSAGE_SELF)),
    Nan::Set(target, Nan::New("RUSAGE_CHILDREN").ToLocalChecked(),      Nan::New(RUSAGE_CHILDREN)),
    ((void)0) ;
}

NODE_MODULE(getrusage, Init)
