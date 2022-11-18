import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore , AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {  ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { CartService } from 'src/app/Services/cart-service/cart.service';
import { PaymentService } from 'src/app/Services/payment-services/payment.service';

declare var $:any;
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  providers: [PaymentService]
})
export class CourseDetailsComponent implements OnInit {
  selectedCourseId: any;
  megaMenuItems: any;
  menuItem: any;
  courseSubMenuItem: any;
  subItemList: any;
  subMenuItem: any;
  selecetdSubCourseId: any;
  menuItemList: any;
  selectedSubMenuCourseTitle: any;
  selectedSubMenuCourseDetails: any;
  courseDetails : any;
  selectedSubjectOverview :any ;
  selectedSubjectFaqs : any ;
  selectedSubjectPriceAndFeatures:any;
  selectedSubjectSyllabus:any ;
  selectedSubjectOverviewImage:any;
  selectedSubjectPrice : any;
  selectedSubjectDiscountPrice:any;
  selectedCourseReviews: any;
  enrollNowForm: any = FormGroup;
  enrollNowFormData : AngularFirestoreCollection<any>;
  submitted = false ;

  constructor(
    public fb: FormBuilder,
    private db: AngularFirestore,
    private dataService:DataService,
    private router: ActivatedRoute,
    private cartservice : CartService,
    private routs: Router,
  ) { }

  ngOnInit(): void {

    this.enrollNowForm = this.fb.group({
      name:['', [Validators.required]],
      email:['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+(\.[a-zA-Z0-9-]+)*')]],
      phone:['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      message:['', [Validators.required]],
      date : new Date(),
    });
    this.enrollNowFormData = this.db.collection('enrollNowForm');
    this.megaMenuItems = this.dataService.getMegaMenu();
    this.menuItem = this.megaMenuItems[0]['normalMenuItems'];
    this.router.params.subscribe(params => {
      this.selectedCourseId = params['menuId'];
      this.selecetdSubCourseId = params ['id'];
      // console.log(this.selectedCourseId);
      this.getSelectedSubmenuCourse(this.selectedCourseId,this.selecetdSubCourseId);
    });
    this.courseDetails = this.dataService.geSubjectDetails();
  }

  getSelectedSubmenuCourse(MenuId:any,ID:any){
    for(let menuItems of this.menuItem){
        // console.log(menuItems);
      if(menuItems.menuId == MenuId){
        this.menuItemList = menuItems.subMenu;
       
        for(let subMenuItem of this.menuItemList){
          // console.log(subMenuItem);
          if(subMenuItem.id == ID){
            this.selectedSubMenuCourseTitle =subMenuItem.title;
            this.selectedSubMenuCourseDetails = subMenuItem.details;
            this.selectedSubjectOverview = subMenuItem.overView;
            this.selectedSubjectFaqs = subMenuItem.faq ;
            this.selectedSubjectPriceAndFeatures = subMenuItem.PricingAndFeatures;
            this.selectedSubjectSyllabus = subMenuItem.syllabus;
            this.selectedSubjectOverviewImage = subMenuItem.overViewImage;
            this.selectedSubjectPrice = subMenuItem.price;
            this.selectedSubjectDiscountPrice = subMenuItem.discount;
            this.selectedCourseReviews = subMenuItem.review;
          }
        }
      }
    }
  }

  get f() {
    return this.enrollNowForm.controls;
  }
  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.enrollNowForm.invalid) {
      return;
    }
    $('#exampleModal').modal('hide');
      this.enrollNowFormData.add(this.enrollNowForm.value).then(res =>{
        this.openModal();
      });
      setTimeout(()=>{
        this.onCloseHandled();
        this.submitted = false ;
        this.enrollNowForm.reset();
      },6000);
  }

  display : any;

   // Model Open Funcation
   openModal(){
    this.display='block';
  }

  // Model close Funcation
  onCloseHandled(){
    this.display='none'
  }

  items:any;
  //----- add item to cart
   addToCart(item:any) {
    if (!this.cartservice.itemInCart(item)) {
      item.qtyTotal = 1;
      this.cartservice.addToCart(item); //add items in cart
      this.items = [...this.cartservice.getItems()];
      this.routs.navigate(['/cart']);
    }
  }

}
