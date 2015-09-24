using LTTS7Lib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace gifbin
{

    class Test : LTTS7Class
    {
        public override event _DLTTS7Events_EndOfSpeechEventHandler EndOfSpeech
        {
            add
            {
                Console.WriteLine("Derived Foo.add called");
            }
            remove
            {
                Console.WriteLine("Derived Foo.remove called");
            }
        }
    }
}
